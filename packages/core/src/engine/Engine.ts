// engine/Engine.ts
import { v4 as uuidv4 } from "uuid";
import { ActionRecord, Concept, SyncRule, Bindings, Pattern } from "./types";

/**
 * The core engine for LegibleSync, managing concepts, actions, and synchronization rules.
 * It handles the execution of actions and the triggering of sync rules based on action patterns.
 */
export class LegibleEngine {
  private concepts: Map<string, Concept> = new Map();
  private actions: ActionRecord[] = [];
  private syncs: SyncRule[] = [];
  private syncTriggering = false;
  private firedSyncs: Set<string> = new Set();
  private invokedActions: Set<string> = new Set();
  private syncGraph: Map<string, Set<string>> = new Map();
  private actionIndex: Map<string, ActionRecord[]> = new Map();

  /**
   * Registers a concept implementation.
   * @param name - The name of the concept.
   * @param impl - The concept implementation.
   */
  registerConcept(name: string, impl: Concept) {
    this.concepts.set(name, impl);
  }

  /**
   * Registers a synchronization rule and checks for cycles in the sync graph.
   * @param sync - The sync rule to register.
   */
  registerSync(sync: SyncRule) {
    this.syncs.push(sync);
    this.updateGraph(sync);
    const cycles = this.detectCycles();
    if (cycles.length > 0) {
      console.warn(
        `Cycle detected in sync graph involving: ${cycles.join(", ")}`,
      );
    }
  }

  private updateGraph(sync: SyncRule) {
    if (!this.syncGraph.has(sync.name)) {
      this.syncGraph.set(sync.name, new Set());
    }
    // For each then, find syncs that can be triggered by this action
    for (const then of sync.then) {
      for (const otherSync of this.syncs) {
        if (otherSync.name === sync.name) continue;
        for (const pattern of otherSync.when) {
          if (
            pattern.concept === then.concept &&
            pattern.action === then.action
          ) {
            this.syncGraph.get(sync.name)!.add(otherSync.name);
            break;
          }
        }
      }
    }
  }

  private detectCycles(): string[] {
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const cycles: string[] = [];

    const dfs = (node: string): boolean => {
      if (recStack.has(node)) {
        cycles.push(node);
        return true;
      }
      if (visited.has(node)) return false;

      visited.add(node);
      recStack.add(node);

      const neighbors = this.syncGraph.get(node) || new Set();
      for (const neighbor of neighbors) {
        if (dfs(neighbor)) {
          cycles.push(node);
          return true;
        }
      }

      recStack.delete(node);
      return false;
    };

    for (const sync of this.syncs) {
      if (!visited.has(sync.name) && dfs(sync.name)) {
        break; // Found a cycle, can stop or collect all
      }
    }

    return cycles;
  }

  /**
   * Invokes an action on a concept, potentially triggering syncs.
   * @param concept - The concept name.
   * @param action - The action name.
   * @param input - The input data for the action.
   * @param flow - The flow identifier.
   * @param syncTriggered - Whether this invoke was triggered by a sync.
   * @returns The output of the action.
   */
  async invoke(
    concept: string,
    action: string,
    input: Record<string, any>,
    flow: string,
    syncTriggered = false,
  ) {
    if (!syncTriggered) {
      this.invokedActions.clear();
    }

    const id = uuidv4();
    const record: ActionRecord = {
      id,
      concept,
      action,
      input,
      flow,
      syncEdges: {},
      syncTriggered,
    };
    this.actions.push(record);

    // Index the action for faster matching
    const key = `${concept}:${action}`;
    if (!this.actionIndex.has(key)) {
      this.actionIndex.set(key, []);
    }
    this.actionIndex.get(key)!.push(record);

    const impl = this.concepts.get(concept);
    if (!impl) throw new Error(`Concept ${concept} not found`);

    // Track invoked actions for loop prevention
    const actionKey = `${concept}:${action}:${JSON.stringify(input)}`;

    // Prevent loops: if we've already invoked this action in this cascade, skip
    if (this.invokedActions.has(actionKey)) {
      return { skipped: true }; // Return a dummy result to avoid errors
    }

    this.invokedActions.add(actionKey);

    try {
      const output = await impl.execute(action, input);
      record.output =
        output && typeof output === "object" ? output : { result: output };
      if (!this.syncTriggering) {
        await this.triggerSyncs();
      }
      return output;
    } catch (err: any) {
      record.output = { error: err.message };
      if (!this.syncTriggering) {
        await this.triggerSyncs();
      }
      throw err;
    }
  }

  private async triggerSyncs() {
    this.syncTriggering = true;
    // Keep firedSyncs across the cascade to prevent duplicate firings
    // Keep invokedActions across the cascade to prevent loops
    try {
      // Run syncs, relying on syncEdges to prevent infinite loops
      for (const sync of this.syncs) {
        await this.tryFireSync(sync);
      }
    } finally {
      this.syncTriggering = false;
    }
  }

  private async tryFireSync(sync: SyncRule): Promise<boolean> {
    // Prevent firing the same sync multiple times in one cascade
    if (this.firedSyncs.has(sync.name)) {
      return false;
    }

    // Collect matching actions for each pattern
    const allMatchingActions: ActionRecord[][] = [];
    for (const pattern of sync.when) {
      const matching = this.matchWhen(pattern, sync.name);
      if (matching.length === 0) {
        return false; // All patterns must have at least one match
      }
      allMatchingActions.push(matching);
    }

    // Extract bindings from each set of matching actions
    const allBindings: Bindings[][] = allMatchingActions.map((actions) =>
      actions.map((action) => {
        const output =
          action.output && typeof action.output === "object"
            ? action.output
            : {};
        return {
          ...action.input,
          ...output,
        };
      }),
    );

    // Generate all combinations of bindings using cartesian product
    let bindingCombinations = this.cartesianProduct(...allBindings);

    // Apply where query filtering if present
    if (sync.where?.filter) {
      bindingCombinations = bindingCombinations.filter(sync.where.filter);
    }

    let fired = false;
    for (const combination of bindingCombinations) {
      // The combination is an array of bindings, one from each pattern
      const mergedBinding: Bindings =
        typeof combination === "object" && combination !== null
          ? { ...combination }
          : {};

      for (const then of sync.then) {
        const input = this.replaceVariables(then.input, mergedBinding);

        try {
          // Use the flow from the first action in the combination
          const flow = allMatchingActions[0][0].flow;
          await this.invoke(then.concept, then.action, input, flow, true);
          fired = true;
        } catch (error) {
          console.error(`Sync ${sync.name} failed:`, error);
        }
      }

      // Mark sync as fired
      if (fired) {
        this.firedSyncs.add(sync.name);
      }

      // Mark this sync as triggered (simplified: mark all involved actions)
      for (const actions of allMatchingActions) {
        for (const action of actions) {
          action.syncEdges = action.syncEdges || {};
          if (!action.syncEdges[sync.name]) {
            action.syncEdges[sync.name] = [uuidv4()];
          }
        }
      }
    }

    return fired;
  }

  private matchWhen(pattern: Pattern, syncName?: string): ActionRecord[] {
    const key = `${pattern.concept}:${pattern.action}`;
    const candidates = this.actionIndex.get(key) || [];
    return candidates.filter((a) => {
      if (!this.matchRecord(a.input, pattern.input)) return false;
      if (!this.matchRecord(a.output || {}, pattern.output)) return false;
      // If syncName is provided, exclude actions that already participated in this sync
      if (syncName && a.syncEdges?.[syncName]) return false;
      return true;
    });
  }

  private matchRecord(obj: any, pattern: any = {}): boolean {
    for (const [k, v] of Object.entries(pattern)) {
      if (obj[k] !== v) return false;
    }
    return true;
  }

  private cartesianProduct(...arrays: any[][]): any[] {
    return arrays.reduce(
      (a, b) => a.flatMap((x) => b.map((y) => ({ ...x, ...y }))),
      [{}],
    );
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  private replaceVariables(obj: any, bindings: Bindings): any {
    if (typeof obj === "string" && obj.startsWith("?")) {
      const varName = obj.substring(1);
      return bindings[varName] || this.getNestedValue(bindings, varName);
    } else if (Array.isArray(obj)) {
      return obj.map((item) => this.replaceVariables(item, bindings));
    } else if (obj !== null && typeof obj === "object") {
      const result: any = {};
      for (const [k, v] of Object.entries(obj)) {
        result[k] = this.replaceVariables(v, bindings);
      }
      return result;
    } else {
      return obj;
    }
  }

  /**
   * Retrieves all actions for a given flow.
   * @param flow - The flow identifier.
   * @returns Array of action records for the flow.
   */
  getActionsByFlow(flow: string): ActionRecord[] {
    return this.actions.filter((a) => a.flow === flow);
  }
}

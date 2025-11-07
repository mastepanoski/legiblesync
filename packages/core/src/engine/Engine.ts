// engine/Engine.ts
import { v4 as uuidv4 } from 'uuid';
import {
  ActionRecord, ConceptImpl, SyncRule, Bindings, Pattern
} from './types';

export class LegibleEngine {
  private concepts: Map<string, ConceptImpl> = new Map();
  private actions: ActionRecord[] = [];
  private syncs: SyncRule[] = [];
  private syncTriggering = false;

  registerConcept(name: string, impl: ConceptImpl) {
    this.concepts.set(name, impl);
  }

  registerSync(sync: SyncRule) {
    this.syncs.push(sync);
  }

  async invoke(concept: string, action: string, input: Record<string, any>, flow: string) {
    const id = uuidv4();
    const record: ActionRecord = {
      id,
      concept,
      action,
      input,
      flow,
      syncEdges: {},
      syncTriggered: this.syncTriggering
    };
    this.actions.push(record);

    const impl = this.concepts.get(concept);
    if (!impl) throw new Error(`Concept ${concept} not found`);

    try {
      const output = await impl.execute(action, input);
      record.output = output;
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
    if (this.syncTriggering) return; // Prevent recursive sync triggering

    this.syncTriggering = true;
    try {
      // Only run syncs once per invoke to avoid infinite loops
      for (const sync of this.syncs) {
        await this.tryFireSync(sync);
      }
    } finally {
      this.syncTriggering = false;
    }
  }

  private async tryFireSync(sync: SyncRule): Promise<boolean> {
    // Collect matching actions for each pattern
    const allMatchingActions: ActionRecord[][] = [];
    for (const pattern of sync.when) {
      const matching = this.matchWhen(pattern);
      if (matching.length === 0) {
        return false; // All patterns must have at least one match
      }
      allMatchingActions.push(matching);
    }

    // Extract bindings from each set of matching actions
    const allBindings: Bindings[][] = allMatchingActions.map(actions =>
      actions.map(action => ({
        ...action.input,
        ...action.output
      }))
    );

    // Generate all combinations of bindings using cartesian product
    const bindingCombinations = this.cartesianProduct(...allBindings);

    let fired = false;
    for (const combination of bindingCombinations) {
      // The combination is already the merged binding object
      const mergedBinding: Bindings = combination;

      // Use the merged binding
      const currentBinding = mergedBinding;
      for (const then of sync.then) {
        const input: Record<string, any> = {};
        for (const [k, v] of Object.entries(then.input)) {
          // Handle variable references like "?user" or "?username"
          if (typeof v === 'string' && v.startsWith('?')) {
            const varName = v.substring(1); // Remove the ?
            input[k] = currentBinding[varName] || this.getNestedValue(currentBinding, varName);
          } else {
            input[k] = v;
          }
        }

        try {
          // Use the flow from the first action in the combination
          const flow = allMatchingActions[0][0].flow;
          await this.invoke(then.concept, then.action, input, flow);
          fired = true;
        } catch (error) {
          console.error(`Sync ${sync.name} failed:`, error);
        }
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

  private matchWhen(pattern: Pattern): ActionRecord[] {
    return this.actions.filter(a => {
      if (a.syncTriggered) return false; // Prevent triggering syncs on sync-triggered actions
      if (a.concept !== pattern.concept || a.action !== pattern.action) return false;
      if (!this.matchRecord(a.input, pattern.input)) return false;
      if (!this.matchRecord(a.output || {}, pattern.output)) return false;
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
    return arrays.reduce((a, b) => a.flatMap(x => b.map(y => ({ ...x, ...y }))), [{}]);
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  getActionsByFlow(flow: string): ActionRecord[] {
    return this.actions.filter(a => a.flow === flow);
  }
}
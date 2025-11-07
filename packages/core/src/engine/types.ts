// engine/types.ts
export type UUID = string;
export type ActionName = string;
export type ConceptName = string;

export interface ActionRecord {
  id: UUID;
  concept: ConceptName;
  action: ActionName;
  input: Record<string, any>;
  output?: Record<string, any>;
  flow: UUID;
  syncEdges: Record<string, UUID[]>; // syncName -> [thenActionId]
  syncTriggered?: boolean;
}

export interface ConceptState {
  [key: string]: any;
}

export type ConceptImpl = {
  state: ConceptState;
  execute(action: ActionName, input: Record<string, any>): Promise<Record<string, any>>;
};

export type SyncRule = {
  name: string;
  when: Pattern[];
  then: {
    concept: ConceptName;
    action: ActionName;
    input: Record<string, any>; // variable names or literal values
  }[];
  syncEdges?: Record<string, string[]>; // for idempotency tracking
};

export type Pattern = {
  concept: ConceptName;
  action: ActionName;
  input?: Partial<Record<string, any>>;
  output?: Partial<Record<string, any>>;
};

export type Bindings = Record<string, any>;
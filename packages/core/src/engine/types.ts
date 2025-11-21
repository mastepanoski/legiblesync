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

export type Concept = {
  state: ConceptState;
  execute(action: ActionName, input: Record<string, any>): Promise<Record<string, any>>;
  rollback?(action: ActionName, input: Record<string, any>, output: Record<string, any>): Promise<void>;
};

export type Query = {
  // Query logic for filtering bindings
  filter?: (bindings: Bindings) => boolean;
};

export type Invocation = {
  concept: ConceptName;
  action: ActionName;
  input: Record<string, any>; // variable names or literal values
};

export type SyncRule = {
  name: string;
  when: Pattern[];
  where?: Query;
  then: Invocation[];
  syncEdges?: Record<string, string[]>; // for idempotency tracking
};

export type Pattern = {
  concept: ConceptName;
  action: ActionName;
  input?: Partial<Record<string, any>>;
  output?: Partial<Record<string, any>>;
};

export type Bindings = Record<string, any>;
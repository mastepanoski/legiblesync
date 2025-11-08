// concepts/Persistence.ts
import { Concept } from '@legible-sync/core';

export const Persistence: Concept = {
  state: {
    triples: [] as Array<{subject: string, predicate: string, object: string}>,
  },

  async execute(action: string, input: any) {
    const state = this.state;

    if (action === 'store') {
      const { subject, predicate, object } = input;
      state.triples.push({ subject, predicate, object });
      return { stored: true };
    }

    if (action === 'query') {
      const { query } = input;
      // Simple query simulation
      const results = state.triples.filter((triple: {subject: string, predicate: string, object: string}) =>
        triple.subject.includes(query.subject || '') &&
        triple.predicate.includes(query.predicate || '')
      );
      return { results };
    }



    throw new Error(`Unknown action: ${action}`);
  }
};
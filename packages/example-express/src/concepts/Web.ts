// concepts/Web.ts
import { Concept } from '@legible-sync/core';
import { v4 as uuidv4 } from 'uuid';

export const Web: Concept = {
  state: {
    responses: new Map<string, any>(),
  },

  async execute(action: string, input: any) {
    if (action === 'request') {
      const { method, path } = input;
      const requestId = uuidv4();
      console.log(`[HTTP] ${method} ${path}`);
      return { request: requestId };
    }

    if (action === 'respond') {
      const { request, code, body } = input;
      console.log(`[HTTP Response] ${code} ->`, JSON.stringify(body, null, 2));
      this.state.responses.set(request, { code, body });
      return {};
    }

    throw new Error(`Unknown action: ${action}`);
  }
};
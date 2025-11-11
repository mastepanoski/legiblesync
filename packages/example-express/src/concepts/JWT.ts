// concepts/JWT.ts
import { Concept } from '@legible-sync/core';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export const JWT: Concept = {
  state: {
    tokens: new Map<string, string>()
  },

  async execute(action: string, input: any) {
    const state = this.state;

    if (action === 'generate') {
      const { user } = input;
      const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '24h' });
      state.tokens.set(user, token);
      return { token };
    }
    if (action === 'verify') {
      const { token } = input;
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { user: string };
        return { user: decoded.user };
      } catch {
        throw new Error('Invalid token');
      }
    }
    if (action === 'reset') {
      state.tokens.clear();
      return { success: true };
    }
    throw new Error(`Unknown action: ${action}`);
  }
};
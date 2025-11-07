// concepts/JWT.ts
import { ConceptImpl } from '@legible-sync/core';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const JWT: ConceptImpl = {
  state: {},

  async execute(action: string, input: any) {
    if (action === 'generate') {
      const { user } = input;
      const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '24h' });
      return { token };
    }
    if (action === 'verify') {
      const { token } = input;
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { user: string };
        return { user: decoded.user };
      } catch (err) {
        throw new Error('Invalid token');
      }
    }
    throw new Error(`Unknown action: ${action}`);
  }
};
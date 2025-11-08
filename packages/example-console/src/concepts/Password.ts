// concepts/Password.ts
import { Concept } from '@legible-sync/core';
import bcrypt from 'bcrypt';

export const Password: Concept = {
  state: {
    password: new Map<string, string>(),
  },

  async execute(action: string, input: any) {
    if (action === 'validate') {
      const { password } = input;
      if (password.length < 6) throw new Error('Password too short');
      return { valid: true };
    }

    if (action === 'set') {
      const { user, password } = input;
      const hashedPassword = await bcrypt.hash(password, 10);
      this.state.password.set(user, hashedPassword);
      return { user };
    }

    if (action === 'verify') {
      const { user, password } = input;
      const hashedPassword = this.state.password.get(user);
      if (!hashedPassword) throw new Error('User not found');
      const isValid = await bcrypt.compare(password, hashedPassword);
      if (!isValid) throw new Error('Invalid password');
      return { user };
    }

    throw new Error(`Unknown action: ${action}`);
  }
};
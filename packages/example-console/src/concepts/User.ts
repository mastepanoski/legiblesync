// concepts/User.ts
import { Concept } from '@legible-sync/core';

export const User: Concept = {
  state: {
    users: new Set<string>(),
    username: new Map<string, string>(),
    email: new Map<string, string>(),
  },

  async execute(action: string, input: any) {
    const state = this.state;

    if (action === 'register') {
      const { user, username, email } = input;
      if (!username || username.trim() === '') throw new Error('Username required');
      if (!email || !email.includes('@')) throw new Error('Valid email required');
      if (state.users.has(user)) throw new Error('User exists');
      if ([...state.username.values()].includes(username)) throw new Error('Username taken');
      if ([...state.email.values()].includes(email)) throw new Error('Email taken');

      state.users.add(user);
      state.username.set(user, username);
      state.email.set(user, email);
      return { user };
    }

    if (action === 'getByUsername') {
      const { username } = input;
      for (const [userId, uname] of state.username) {
        if (uname === username) {
          return { user: userId, username, email: state.email.get(userId) };
        }
      }
      throw new Error('User not found');
    }

    throw new Error(`Unknown action: ${action}`);
  }
};
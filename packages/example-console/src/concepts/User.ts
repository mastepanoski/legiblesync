// concepts/User.ts
import { ConceptImpl } from '@legible-sync/core';
import { v4 as uuidv4 } from 'uuid';

export const User: ConceptImpl = {
  state: {
    users: new Set<string>(),
    username: new Map<string, string>(),
    email: new Map<string, string>(),
  },

  async execute(action: string, input: any) {
    const state = this.state;

    if (action === 'register') {
      const { user, username, email } = input;
      if (state.users.has(user)) throw new Error('User exists');
      if ([...state.username.values()].includes(username)) throw new Error('Username taken');
      if ([...state.email.values()].includes(email)) throw new Error('Email taken');

      state.users.add(user);
      state.username.set(user, username);
      state.email.set(user, email);
      return { user };
    }

    throw new Error(`Unknown action: ${action}`);
  }
};
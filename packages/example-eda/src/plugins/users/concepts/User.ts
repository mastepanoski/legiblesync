// plugins/users/concepts/User.ts
import { Concept } from '@legible-sync/core';
import { v4 as uuidv4 } from 'uuid';

export const User: Concept = {
  state: {
    users: new Map<string, any>(),
    emails: new Set<string>(),
    usernames: new Set<string>(),
  },

  async execute(action: string, input: any) {
    const state = this.state;

    switch (action) {
      case 'register': {
        const { username, email, password } = input;

        // Validation
        if (!username || !email || !password) {
          throw new Error('Username, email, and password are required');
        }

        if (state.emails.has(email)) {
          throw new Error('Email already registered');
        }

        if (state.usernames.has(username)) {
          throw new Error('Username already taken');
        }

        // Create user
        const userId = uuidv4();
        const user = {
          id: userId,
          username,
          email,
          createdAt: new Date(),
          status: 'active'
        };

        state.users.set(userId, user);
        state.emails.add(email);
        state.usernames.add(username);

        return { userId, user };
      }

      case 'get': {
        const { userId } = input;
        const user = state.users.get(userId);
        if (!user) {
          throw new Error('User not found');
        }
        return { user };
      }

      case 'update': {
        const { userId, updates } = input;
        const user = state.users.get(userId);
        if (!user) {
          throw new Error('User not found');
        }

        // Update user
        const updatedUser = { ...user, ...updates, updatedAt: new Date() };
        state.users.set(userId, updatedUser);

        return { user: updatedUser };
      }

       case 'deactivate': {
         const { userId } = input;
         const user = state.users.get(userId);
         if (!user) {
           throw new Error('User not found');
         }

         user.status = 'inactive';
         user.deactivatedAt = new Date();
         state.users.set(userId, user);

         return { user };
       }

       case 'reset': {
         state.users.clear();
         state.emails.clear();
         state.usernames.clear();
         return { reset: true };
       }

       default:
         throw new Error(`Unknown action: ${action}`);
    }
  }
};
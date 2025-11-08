// concepts/Favorite.ts
import { Concept } from '@legible-sync/core';

export const Favorite: Concept = {
  state: {
    favorites: new Map<string, Set<string>>(), // article -> Set<user>
  },

  async execute(action: string, input: any) {
    const state = this.state;

    if (action === 'add') {
      const { article, user } = input;
      if (!state.favorites.has(article)) {
        state.favorites.set(article, new Set());
      }
      state.favorites.get(article)!.add(user);
      return { article };
    }

    if (action === 'remove') {
      const { article, user } = input;
      if (state.favorites.has(article)) {
        state.favorites.get(article)!.delete(user);
      }
      return { article };
    }

    throw new Error(`Unknown action: ${action}`);
  }
};
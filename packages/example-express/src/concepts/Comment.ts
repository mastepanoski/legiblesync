// concepts/Comment.ts
import { Concept } from '@legible-sync/core';

export const Comment: Concept = {
  state: {
    comments: new Set<string>(),
    article: new Map<string, string>(),
    author: new Map<string, string>(),
    body: new Map<string, string>(),
    createdAt: new Map<string, Date>(),
  },

  async execute(action: string, input: any) {
    const state = this.state;

    if (action === 'create') {
      const { comment, article, author, body } = input;
      if (!body) throw new Error('Comment body required');

      state.comments.add(comment);
      state.article.set(comment, article);
      state.author.set(comment, author);
      state.body.set(comment, body);
      state.createdAt.set(comment, new Date());

      return { comment };
    }

    throw new Error(`Unknown action: ${action}`);
  }
};
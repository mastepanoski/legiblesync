// concepts/Comment.ts
import { Concept } from '@legible-sync/core';

export const Comment: Concept = {
  state: {
    comments: new Set<string>(),
    articleId: new Map<string, string>(),
    authorId: new Map<string, string>(),
    content: new Map<string, string>(),
    createdAt: new Map<string, Date>(),
  },

  async execute(action: string, input: any) {
    const state = this.state;

    if (action === 'create') {
      const { articleId, authorId, content } = input;
      if (!content) throw new Error('Comment content required');

      const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      state.comments.add(commentId);
      state.articleId.set(commentId, articleId);
      state.authorId.set(commentId, authorId);
      state.content.set(commentId, content);
      state.createdAt.set(commentId, new Date());

      return {
        commentId,
        comment: {
          articleId,
          authorId,
          content
        }
      };
    }

    if (action === 'get') {
      const { commentId } = input;
      if (!state.comments.has(commentId)) throw new Error('Comment not found');

      return {
        comment: {
          articleId: state.articleId.get(commentId),
          authorId: state.authorId.get(commentId),
          content: state.content.get(commentId),
          createdAt: state.createdAt.get(commentId)
        }
      };
    }

    if (action === 'listByArticle') {
      const { articleId } = input;
      const comments = [];
      for (const commentId of state.comments) {
        if (state.articleId.get(commentId) === articleId) {
          comments.push({
            articleId: state.articleId.get(commentId),
            authorId: state.authorId.get(commentId),
            content: state.content.get(commentId)
          });
        }
      }
      return { comments };
    }

    throw new Error(`Unknown action: ${action}`);
  }
};
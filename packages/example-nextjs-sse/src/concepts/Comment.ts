// concepts/Comment.ts
import { Concept } from '@legible-sync/core';

export const Comment: Concept = {
  state: {
    comments: new Set<string>(),
    timestamp: new Map<string, string>(),
    nombre: new Map<string, string>(),
    comentario: new Map<string, string>(),
  },

  async execute(action: string, input: any) {
    const state = this.state;

    if (action === 'create') {
      const { nombre, comentario } = input;
      if (!nombre || !comentario) throw new Error('Nombre and comentario required');

      const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date().toISOString();

      state.comments.add(commentId);
      state.timestamp.set(commentId, timestamp);
      state.nombre.set(commentId, nombre);
      state.comentario.set(commentId, comentario);

      return { commentId, timestamp, nombre, comentario };
    }

    throw new Error(`Unknown action: ${action}`);
  }
};
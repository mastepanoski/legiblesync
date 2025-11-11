// concepts/SSEEmitter.ts
import { Concept } from '@legible-sync/core';

declare global {
  var socketIo: any;
}

export const SSEEmitter: Concept = {
  state: {},

  async execute(action: string, input: any) {
    if (action === 'emitNewComment') {
      const { timestamp, nombre, comentario } = input;
      if (global.socketIo) {
        // Emit with English field names for frontend compatibility
        global.socketIo.emit('new_comment', { timestamp, name: nombre, comment: comentario });
      }
      return { success: true };
    }

    throw new Error(`Unknown action: ${action}`);
  }
};
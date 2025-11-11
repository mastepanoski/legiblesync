// concepts/Logger.ts
import { Concept } from '@legible-sync/core';
import * as fs from 'fs';
import * as path from 'path';

export const Logger: Concept = {
  state: {},

  async execute(action: string, input: any) {
    if (action === 'logCommentCreation') {
      const { timestamp, nombre, comentario } = input;

      const LOG_FILE = path.join(process.cwd(), 'logs', 'comments.log');

      // Ensure directory exists
      const dir = path.dirname(LOG_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const logEntry = `[${timestamp}] Comment created by ${nombre}: ${comentario}\n`;
      fs.appendFileSync(LOG_FILE, logEntry);

      return { success: true };
    }

    throw new Error(`Unknown action: ${action}`);
  }
};
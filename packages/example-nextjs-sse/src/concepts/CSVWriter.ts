// concepts/CSVWriter.ts
import { Concept } from '@legible-sync/core';
import * as fs from 'fs';
import * as path from 'path';

export const CSVWriter: Concept = {
  state: {},

  async execute(action: string, input: any) {
    if (action === 'appendComment') {
      const { timestamp, nombre, comentario } = input;

      const CSV_FILE = path.join(process.cwd(), 'data', 'comments.csv');

      // Ensure directory exists
      const dir = path.dirname(CSV_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Check if file exists and has header
      const fileExists = fs.existsSync(CSV_FILE);
      if (!fileExists) {
        // Write header
        fs.writeFileSync(CSV_FILE, 'timestamp,nombre,comentario\n');
      }

      // Append new row (escape commas in fields if needed, but for simplicity assume no commas)
      const newRow = `${timestamp},${nombre},${comentario}\n`;
      fs.appendFileSync(CSV_FILE, newRow);

      return { success: true };
    }

    throw new Error(`Unknown action: ${action}`);
  }
};
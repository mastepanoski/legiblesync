import { NextRequest, NextResponse } from 'next/server';
import { LegibleEngine } from '@legible-sync/core';
import { Comment } from '../../../concepts/Comment';
import { commentSyncs } from '../../../syncs/comment.sync';
import { loggingSyncs } from '../../../syncs/logging.sync';
import { CSVWriter } from '../../../concepts/CSVWriter';
import { SSEEmitter } from '../../../concepts/SSEEmitter';
import { Logger } from '../../../concepts/Logger';
import * as fs from 'fs';
import * as path from 'path';

const CSV_FILE = path.join(process.cwd(), 'data', 'comments.csv');

export async function GET() {
  try {
    if (!fs.existsSync(CSV_FILE)) {
      return NextResponse.json([]);
    }

    const csvContent = fs.readFileSync(CSV_FILE, 'utf8');
    const lines = csvContent.trim().split('\n');
    const comments = lines.slice(1).map(line => {
      const [timestamp, nombre, comentario] = line.split(',');
      // Convert Spanish field names to English for frontend
      return { timestamp, name: nombre, comment: comentario };
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error reading comments:', error);
    return NextResponse.json({ error: 'Failed to read comments' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  const engine = new LegibleEngine();
  engine.registerConcept('Comment', Comment);
  engine.registerConcept('CSVWriter', CSVWriter);
  engine.registerConcept('SSEEmitter', SSEEmitter);
  engine.registerConcept('Logger', Logger);
  [...commentSyncs, ...loggingSyncs].forEach(sync => engine.registerSync(sync));
  try {
    const { name, comment } = await request.json();

    if (!name || !comment) {
      return NextResponse.json({ error: 'Name and comment are required' }, { status: 400 });
    }

    // Use the engine to create comment, which will trigger syncs
    // Map English field names to Spanish field names expected by concepts
    await engine.invoke('Comment', 'create', { nombre: name, comentario: comment }, `create-comment-${Date.now()}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

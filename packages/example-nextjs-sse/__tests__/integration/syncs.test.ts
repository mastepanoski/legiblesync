import { LegibleEngine } from '@legible-sync/core';
import { Comment } from '../../src/concepts/Comment';
import { CSVWriter } from '../../src/concepts/CSVWriter';
import { SSEEmitter } from '../../src/concepts/SSEEmitter';
import { Logger } from '../../src/concepts/Logger';
import { commentSyncs } from '../../src/syncs/comment.sync';
import { loggingSyncs } from '../../src/syncs/logging.sync';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

// Mock global.socketIo
const mockEmit = jest.fn();
(global as any).socketIo = {
  emit: mockEmit
};

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe('Sync Integration Tests', () => {
  let engine: LegibleEngine;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPath.join.mockImplementation((...args) => args.join('/'));
    mockPath.dirname.mockImplementation((p) => {
      if (p.includes('comments.csv')) return '/mock/data';
      if (p.includes('comments.log')) return '/mock/logs';
      return '/mock';
    });
    jest.spyOn(process, 'cwd').mockReturnValue('/mock');
    mockFs.existsSync.mockReturnValue(false);
    mockFs.mkdirSync.mockImplementation();
    mockFs.writeFileSync.mockImplementation();
    mockFs.appendFileSync.mockImplementation();

    engine = new LegibleEngine();
    engine.registerConcept('Comment', Comment);
    engine.registerConcept('CSVWriter', CSVWriter);
    engine.registerConcept('SSEEmitter', SSEEmitter);
    engine.registerConcept('Logger', Logger);
    [...commentSyncs, ...loggingSyncs].forEach(sync => engine.registerSync(sync));
  });

  afterEach(() => {
    // Reset concept states
    Comment.state.comments.clear();
    Comment.state.timestamp.clear();
    Comment.state.nombre.clear();
    Comment.state.comentario.clear();
    jest.restoreAllMocks();
  });

  it('should trigger all syncs when comment is created', async () => {
    const result = await engine.invoke('Comment', 'create', {
      nombre: 'Integration Test User',
      comentario: 'Integration test comment'
    }, 'test-flow');

    expect(result).toHaveProperty('commentId');
    expect(result.nombre).toBe('Integration Test User');
    expect(result.comentario).toBe('Integration test comment');

    // Check Socket.IO event was emitted
    expect(mockEmit).toHaveBeenCalledWith('new_comment', {
      timestamp: expect.any(String),
      name: 'Integration Test User',
      comment: 'Integration test comment'
    });

    // Note: CSV and log writing are tested in unit tests
  });

  it('should trigger syncs multiple times for different comments', async () => {
    // First comment
    const result1 = await engine.invoke('Comment', 'create', {
      nombre: 'User 1',
      comentario: 'Comment 1'
    }, 'test-flow-1');

    expect(result1.nombre).toBe('User 1');
    expect(mockEmit).toHaveBeenNthCalledWith(1, 'new_comment', expect.objectContaining({
      name: 'User 1',
      comment: 'Comment 1'
    }));

    // Second comment
    const result2 = await engine.invoke('Comment', 'create', {
      nombre: 'User 2',
      comentario: 'Comment 2'
    }, 'test-flow-2');

    expect(result2.nombre).toBe('User 2');
    expect(mockEmit).toHaveBeenNthCalledWith(2, 'new_comment', expect.objectContaining({
      name: 'User 2',
      comment: 'Comment 2'
    }));

    // Check that emit was called twice
    expect(mockEmit).toHaveBeenCalledTimes(2);
  });
});
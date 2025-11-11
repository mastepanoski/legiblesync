import { Logger } from '../../../src/concepts/Logger';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe('Logger Concept', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPath.join.mockImplementation((...args) => args.join('/'));
    mockPath.dirname.mockReturnValue('/mock/logs');
    jest.spyOn(process, 'cwd').mockReturnValue('/mock');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log comment creation', async () => {
    mockFs.existsSync.mockReturnValue(false);
    mockFs.mkdirSync.mockImplementation();
    mockFs.appendFileSync.mockImplementation();

    const result = await Logger.execute('logCommentCreation', {
      timestamp: '2023-01-01T00:00:00.000Z',
      nombre: 'Test User',
      comentario: 'Test comment'
    });

    expect(result).toEqual({ success: true });
    expect(mockFs.existsSync).toHaveBeenCalledWith('/mock/logs');
    expect(mockFs.mkdirSync).toHaveBeenCalledWith('/mock/logs', { recursive: true });
    expect(mockFs.appendFileSync).toHaveBeenCalledWith(expect.any(String), '[2023-01-01T00:00:00.000Z] Comment created by Test User: Test comment\n');
  });

  it('should throw error for unknown action', async () => {
    await expect(Logger.execute('unknown', {})).rejects.toThrow('Unknown action: unknown');
  });
});
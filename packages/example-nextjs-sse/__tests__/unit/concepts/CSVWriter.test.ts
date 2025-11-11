import { CSVWriter } from '../../../src/concepts/CSVWriter';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe('CSVWriter Concept', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPath.join.mockImplementation((...args) => args.join('/'));
    mockPath.dirname.mockReturnValue('/mock/data');
    jest.spyOn(process, 'cwd').mockReturnValue('/mock');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should append comment to CSV', async () => {
    mockFs.existsSync.mockReturnValue(false);
    mockFs.mkdirSync.mockImplementation();
    mockFs.writeFileSync.mockImplementation();
    mockFs.appendFileSync.mockImplementation();

    const result = await CSVWriter.execute('appendComment', {
      timestamp: '2023-01-01T00:00:00.000Z',
      nombre: 'Test User',
      comentario: 'Test comment'
    });

    expect(result).toEqual({ success: true });
    expect(mockFs.existsSync).toHaveBeenCalledWith('/mock/data');
    expect(mockFs.mkdirSync).toHaveBeenCalledWith('/mock/data', { recursive: true });
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(expect.any(String), 'timestamp,nombre,comentario\n');
    expect(mockFs.appendFileSync).toHaveBeenCalledWith(expect.any(String), '2023-01-01T00:00:00.000Z,Test User,Test comment\n');
  });

  it('should throw error for unknown action', async () => {
    await expect(CSVWriter.execute('unknown', {})).rejects.toThrow('Unknown action: unknown');
  });
});
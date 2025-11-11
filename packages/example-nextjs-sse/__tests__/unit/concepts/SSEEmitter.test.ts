import { SSEEmitter } from '../../../src/concepts/SSEEmitter';

const mockEmit = jest.fn();
(global as any).socketIo = {
  emit: mockEmit
};

describe('SSEEmitter Concept', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should emit new comment event', async () => {
    const result = await SSEEmitter.execute('emitNewComment', {
      timestamp: '2023-01-01T00:00:00.000Z',
      nombre: 'Test User',
      comentario: 'Test comment'
    });

    expect(result).toEqual({ success: true });
    expect(mockEmit).toHaveBeenCalledWith('new_comment', {
      timestamp: '2023-01-01T00:00:00.000Z',
      name: 'Test User',
      comment: 'Test comment'
    });
  });

  it('should throw error for unknown action', async () => {
    await expect(SSEEmitter.execute('unknown', {})).rejects.toThrow('Unknown action: unknown');
  });
});
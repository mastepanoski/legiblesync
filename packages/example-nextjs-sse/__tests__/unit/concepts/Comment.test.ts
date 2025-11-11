import { Comment } from '../../../src/concepts/Comment';

describe('Comment Concept', () => {
  beforeEach(() => {
    // Reset state
    Comment.state.comments.clear();
    Comment.state.timestamp.clear();
    Comment.state.nombre.clear();
    Comment.state.comentario.clear();
  });

  it('should create a comment successfully', async () => {
    const result = await Comment.execute('create', {
      nombre: 'Test User',
      comentario: 'Test comment'
    });

    expect(result).toHaveProperty('commentId');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('nombre', 'Test User');
    expect(result).toHaveProperty('comentario', 'Test comment');

    expect(Comment.state.comments.size).toBe(1);
    expect(Comment.state.nombre.get(result.commentId)).toBe('Test User');
  });

  it('should throw error for missing nombre', async () => {
    await expect(Comment.execute('create', {
      comentario: 'Test comment'
    })).rejects.toThrow('Nombre and comentario required');
  });

  it('should throw error for missing comentario', async () => {
    await expect(Comment.execute('create', {
      nombre: 'Test User'
    })).rejects.toThrow('Nombre and comentario required');
  });

  it('should throw error for unknown action', async () => {
    await expect(Comment.execute('unknown', {})).rejects.toThrow('Unknown action: unknown');
  });
});
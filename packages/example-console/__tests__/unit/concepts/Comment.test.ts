import { Comment } from '../../../src/concepts/Comment';

describe('Comment Concept', () => {
  beforeEach(() => {
    Comment.state.comments.clear();
    Comment.state.articleId.clear();
    Comment.state.authorId.clear();
    Comment.state.content.clear();
    Comment.state.createdAt.clear();
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      const result = await Comment.execute('create', {
        articleId: 'article123',
        authorId: 'user123',
        content: 'This is a comment'
      });

      expect(result.commentId).toBeDefined();
      expect(result.comment.articleId).toBe('article123');
      expect(result.comment.authorId).toBe('user123');
      expect(result.comment.content).toBe('This is a comment');
    });

    it('should throw error for empty content', async () => {
      await expect(Comment.execute('create', {
        articleId: 'article123',
        authorId: 'user123',
        content: ''
      })).rejects.toThrow('Comment content required');
    });
  });

  describe('get', () => {
    let commentId: string;

    beforeEach(async () => {
      const result = await Comment.execute('create', {
        articleId: 'article123',
        authorId: 'user123',
        content: 'This is a comment'
      });
      commentId = result.commentId;
    });

    it('should get comment by id', async () => {
      const result = await Comment.execute('get', { commentId });

      expect(result.comment.content).toBe('This is a comment');
      expect(result.comment.articleId).toBe('article123');
    });

    it('should throw error for non-existent comment', async () => {
      await expect(Comment.execute('get', { commentId: 'nonexistent' })).rejects.toThrow('Comment not found');
    });

    it('should get comment and include createdAt', async () => {
      const result = await Comment.execute('get', { commentId });

      expect(result.comment.content).toBe('This is a comment');
      expect(result.comment.articleId).toBe('article123');
      expect(result.comment.createdAt).toBeDefined();
    });
  });

  describe('listByArticle', () => {
    beforeEach(async () => {
      await Comment.execute('create', {
        articleId: 'article123',
        authorId: 'user123',
        content: 'Comment 1'
      });
      await Comment.execute('create', {
        articleId: 'article123',
        authorId: 'user456',
        content: 'Comment 2'
      });
      await Comment.execute('create', {
        articleId: 'article456',
        authorId: 'user123',
        content: 'Comment 3'
      });
    });

    it('should list comments by article', async () => {
      const result = await Comment.execute('listByArticle', { articleId: 'article123' });

      expect(result.comments).toHaveLength(2);
      expect(result.comments[0].content).toBe('Comment 1');
      expect(result.comments[1].content).toBe('Comment 2');
    });

    it('should return empty list for article with no comments', async () => {
      const result = await Comment.execute('listByArticle', { articleId: 'article999' });

      expect(result.comments).toHaveLength(0);
    });
  });
});
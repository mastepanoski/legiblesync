import { Article } from '../../../src/concepts/Article';

describe('Article Concept', () => {
  beforeEach(() => {
    Article.state.articles.clear();
    Article.state.title.clear();
    Article.state.body.clear();
    Article.state.author.clear();
    Article.state.slug.clear();
  });

  describe('create', () => {
    it('should create a new article', async () => {
      const result = await Article.execute('create', {
        article: 'article123',
        title: 'Test Article',
        body: 'This is a test article',
        author: 'user123'
      });

      expect(result.article).toBe('article123');
      expect(result.slug).toBe('test-article');
      expect(Article.state.articles.has('article123')).toBe(true);
      expect(Article.state.title.get('article123')).toBe('Test Article');
      expect(Article.state.body.get('article123')).toBe('This is a test article');
      expect(Article.state.author.get('article123')).toBe('user123');
    });

    it('should throw error for missing title', async () => {
      await expect(Article.execute('create', {
        article: 'article123',
        body: 'Content',
        author: 'user123'
      })).rejects.toThrow('Title required');
    });

    it('should throw error for slug collision', async () => {
      await Article.execute('create', {
        article: 'article123',
        title: 'Test Article',
        body: 'Content 1',
        author: 'user123'
      });

      await expect(Article.execute('create', {
        article: 'article456',
        title: 'Test Article',
        body: 'Content 2',
        author: 'user456'
      })).rejects.toThrow('Slug collision');
    });

    it('should handle special characters in title for slug', async () => {
      const result = await Article.execute('create', {
        article: 'article123',
        title: 'Test Article!@#',
        body: 'Content',
        author: 'user123'
      });

      expect(result.slug).toBe('test-article');
    });
  });
});
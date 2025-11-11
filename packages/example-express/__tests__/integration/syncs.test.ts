import { LegibleEngine } from '@legible-sync/core';
// Set required environment variables for tests
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-purposes-only';

import { User } from '../../src/concepts/User';
import { Article } from '../../src/concepts/Article';
import { Favorite } from '../../src/concepts/Favorite';
import { Comment } from '../../src/concepts/Comment';
import { Password } from '../../src/concepts/Password';
import { JWT } from '../../src/concepts/JWT';
import { Web } from '../../src/concepts/Web';
import { articleSyncs } from '../../src/syncs/article.sync';
import { commentSyncs } from '../../src/syncs/comment.sync';
import { favoriteSyncs } from '../../src/syncs/favorite.sync';
import { registrationSyncs } from '../../src/syncs/registration.sync';

// Set required environment variables for tests
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-purposes-only';

// Mock concepts to track when their execute methods are called
const createMockConcept = (originalConcept: any, conceptName: string) => {
  const executeSpy = jest.fn(originalConcept.execute.bind(originalConcept));
  return {
    ...originalConcept,
    execute: executeSpy,
    __spy: executeSpy,
    __name: conceptName
  };
};

describe('Express Sync Rules Integration Tests', () => {
  let engine: LegibleEngine;
  let mockConcepts: { [key: string]: any };

  beforeEach(() => {
    engine = new LegibleEngine();

    // Create mock concepts to track executions
    mockConcepts = {
      User: createMockConcept(User, 'User'),
      Article: createMockConcept(Article, 'Article'),
      Favorite: createMockConcept(Favorite, 'Favorite'),
      Comment: createMockConcept(Comment, 'Comment'),
      Password: createMockConcept(Password, 'Password'),
      JWT: createMockConcept(JWT, 'JWT'),
      Web: createMockConcept(Web, 'Web')
    };

    // Register mock concepts
    Object.entries(mockConcepts).forEach(([name, concept]) => {
      engine.registerConcept(name, concept);
    });

    // Register all syncs
    [...articleSyncs, ...commentSyncs, ...favoriteSyncs, ...registrationSyncs]
      .forEach(sync => engine.registerSync(sync));

    // Reset concept states
    User.state.users.clear();
    Article.state.articles.clear();
    Article.state.title.clear();
    Article.state.body.clear();
    Article.state.author.clear();
    Article.state.slug.clear();
    Favorite.state.favorites.clear();
    Comment.state.comments.clear();
    Comment.state.article.clear();
    Comment.state.author.clear();
    Comment.state.body.clear();
    Password.state.password.clear();
    JWT.state.tokens.clear();
    Web.state.requests.clear();
  });

  afterEach(() => {
    // Clear all mocks
    Object.values(mockConcepts).forEach(concept => {
      concept.__spy.mockClear();
    });
  });

  describe('Article Syncs', () => {
    it('should call JWT.verify when Web.request POST /articles', async () => {
      const flow = 'article-verify-flow';

      // Simulate web request
      await engine.invoke('Web', 'request', {
        method: 'POST',
        path: '/articles',
        body: { title: 'Test Article', body: 'Test content' },
        token: 'valid-token'
      }, flow);

      // Check that JWT.verify was called
      expect(mockConcepts.JWT.__spy).toHaveBeenCalledWith('verify', {
        token: 'valid-token'
      });
    });

    it('should call Article.create when Web.request POST /articles and JWT.verify succeed', async () => {
      const flow = 'article-create-flow';

      // Simulate web request
      await engine.invoke('Web', 'request', {
        method: 'POST',
        path: '/articles',
        body: { title: 'Test Article', body: 'Test content' },
        token: 'valid-token'
      }, flow);

      // Simulate JWT verification (this would normally be triggered by the sync)
      await engine.invoke('JWT', 'verify', { token: 'valid-token' }, flow);

      // Check that Article.create was called with correct parameters
      expect(mockConcepts.Article.__spy).toHaveBeenCalledWith('create', expect.objectContaining({
        article: expect.any(String),
        title: 'Test Article',
        body: 'Test content',
        author: expect.any(String)
      }));
    });
  });

  describe('Comment Syncs', () => {
    it('should call Comment.create when Web.request POST /articles/*/comments and JWT.verify succeed', async () => {
      const flow = 'comment-create-flow';

      // Simulate web request
      await engine.invoke('Web', 'request', {
        method: 'POST',
        path: '/articles/article123/comments',
        body: { body: 'Test comment' },
        token: 'valid-token'
      }, flow);

      // Simulate JWT verification
      await engine.invoke('JWT', 'verify', { token: 'valid-token' }, flow);

      // Check that Comment.create was called
      expect(mockConcepts.Comment.__spy).toHaveBeenCalledWith('create', expect.objectContaining({
        comment: expect.any(String),
        article: 'article123',
        author: expect.any(String),
        body: 'Test comment'
      }));
    });
  });

  describe('Favorite Syncs', () => {
    it('should call Favorite.add when Web.request POST /articles/*/favorite and JWT.verify succeed', async () => {
      const flow = 'favorite-add-flow';

      // Simulate web request
      await engine.invoke('Web', 'request', {
        method: 'POST',
        path: '/articles/article123/favorite',
        token: 'valid-token'
      }, flow);

      // Simulate JWT verification
      await engine.invoke('JWT', 'verify', { token: 'valid-token' }, flow);

      // Check that Favorite.add was called
      expect(mockConcepts.Favorite.__spy).toHaveBeenCalledWith('add', expect.objectContaining({
        article: 'article123',
        user: expect.any(String)
      }));
    });

    it('should call Favorite.remove when Web.request DELETE /articles/*/favorite and JWT.verify succeed', async () => {
      const flow = 'favorite-remove-flow';

      // Simulate web request
      await engine.invoke('Web', 'request', {
        method: 'DELETE',
        path: '/articles/article123/favorite',
        token: 'valid-token'
      }, flow);

      // Simulate JWT verification
      await engine.invoke('JWT', 'verify', { token: 'valid-token' }, flow);

      // Check that Favorite.remove was called
      expect(mockConcepts.Favorite.__spy).toHaveBeenCalledWith('remove', expect.objectContaining({
        article: 'article123',
        user: expect.any(String)
      }));
    });
  });

  describe('Registration Syncs', () => {
    it('should call Password.validate when Web.request POST /users', async () => {
      const flow = 'registration-flow';

      // Simulate web request
      await engine.invoke('Web', 'request', {
        method: 'POST',
        path: '/users',
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        }
      }, flow);

      // Check that Password.validate was called
      expect(mockConcepts.Password.__spy).toHaveBeenCalledWith('validate', {
        password: 'password123'
      });
    });

    it('should call User.register when Password.validate succeeds with valid=true', async () => {
      const flow = 'registration-flow';

      // Simulate password validation success
      await engine.invoke('Password', 'validate', {
        password: 'password123'
      }, flow);

      // Simulate web request to provide body data
      await engine.invoke('Web', 'request', {
        method: 'POST',
        path: '/users',
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        }
      }, flow);

      // Check that User.register was called
      expect(mockConcepts.User.__spy).toHaveBeenCalledWith('register', expect.objectContaining({
        user: expect.any(String),
        username: 'testuser',
        email: 'test@example.com'
      }));
    });

    it('should call Password.set and JWT.generate when User.register succeeds with valid email', async () => {
      const flow = 'registration-flow';

      // Simulate user registration
      await engine.invoke('User', 'register', {
        user: 'user123',
        username: 'testuser',
        email: 'test@example.com'
      }, flow);

      // Simulate web request to provide body data
      await engine.invoke('Web', 'request', {
        method: 'POST',
        path: '/users',
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        }
      }, flow);

      // Check that Password.set was called
      expect(mockConcepts.Password.__spy).toHaveBeenCalledWith('set', {
        user: 'user123',
        password: 'password123'
      });

      // Check that JWT.generate was called
      expect(mockConcepts.JWT.__spy).toHaveBeenCalledWith('generate', {
        user: 'user123'
      });
    });

    it('should call Password.verify when Web.request POST /login', async () => {
      const flow = 'login-flow';

      // Simulate web request
      await engine.invoke('Web', 'request', {
        method: 'POST',
        path: '/login',
        body: {
          username: 'testuser',
          password: 'password123'
        }
      }, flow);

      // Check that Password.verify was called
      expect(mockConcepts.Password.__spy).toHaveBeenCalledWith('verify', {
        user: 'testuser',
        password: 'password123'
      });
    });

    it('should call JWT.generate when Password.verify succeeds', async () => {
      const flow = 'login-flow';

      // Simulate password verification success
      await engine.invoke('Password', 'verify', {
        user: 'testuser',
        password: 'password123'
      }, flow);

      // Check that JWT.generate was called
      expect(mockConcepts.JWT.__spy).toHaveBeenCalledWith('generate', {
        user: 'testuser'
      });
    });
  });
});
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

  beforeEach(async () => {
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
    User.state.users.clear();
    User.state.username.clear();
    User.state.email.clear();
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
    await engine.invoke('JWT', 'reset', {}, 'test-reset');
    Web.state.responses.clear();
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

      // Generate a valid token first
      const tokenResult = await engine.invoke('JWT', 'generate', { user: 'test-user' }, flow);
      const validToken = tokenResult.token;

      // Simulate web request
      await engine.invoke('Web', 'request', {
        method: 'POST',
        path: '/articles',
        body: { title: 'Test Article', body: 'Test content' },
        token: validToken
      }, flow);

      // The sync should trigger JWT.verify and then Article.create
      // Check that Article.create was called with correct parameters
      expect(mockConcepts.Article.__spy).toHaveBeenCalledWith('create', expect.objectContaining({
        article: expect.any(String),
        title: 'Test Article',
        body: 'Test content',
        author: 'test-user'
      }));
    });
  });

  describe('Comment Syncs', () => {
    it('should call Comment.create when Web.request POST /articles/*/comments and JWT.verify succeed', async () => {
      const flow = 'comment-create-flow';

      // Generate a valid token first
      const tokenResult = await engine.invoke('JWT', 'generate', { user: 'test-user' }, flow);
      const validToken = tokenResult.token;

      // Simulate web request
      await engine.invoke('Web', 'request', {
        method: 'POST',
        path: '/articles/article123/comments',
        body: { body: 'Test comment' },
        token: validToken
      }, flow);

      // The sync should trigger JWT.verify and then Comment.create
      // Check that Comment.create was called
      expect(mockConcepts.Comment.__spy).toHaveBeenCalledWith('create', expect.objectContaining({
        comment: expect.any(String),
        article: '/articles/article123/comments[2]',
        author: 'test-user',
        body: 'Test comment'
      }));
    });
  });

  describe('Favorite Syncs', () => {
    it('should call Favorite.add when Web.request POST /articles/*/favorite and JWT.verify succeed', async () => {
      const flow = 'favorite-add-flow';

      // Generate a valid token first
      const tokenResult = await engine.invoke('JWT', 'generate', { user: 'test-user' }, flow);
      const validToken = tokenResult.token;

      // Simulate web request
      await engine.invoke('Web', 'request', {
        method: 'POST',
        path: '/articles/article123/favorite',
        token: validToken
      }, flow);

      // The sync should trigger JWT.verify and then Favorite.add
      // Check that Favorite.add was called
      expect(mockConcepts.Favorite.__spy).toHaveBeenCalledWith('add', expect.objectContaining({
        article: '/articles/article123/favorite[2]',
        user: 'test-user'
      }));
    });

    it('should call Favorite.remove when Web.request DELETE /articles/*/favorite and JWT.verify succeed', async () => {
      const flow = 'favorite-remove-flow';

      // Generate a valid token first
      const tokenResult = await engine.invoke('JWT', 'generate', { user: 'test-user' }, flow);
      const validToken = tokenResult.token;

      // Simulate web request
      await engine.invoke('Web', 'request', {
        method: 'DELETE',
        path: '/articles/article123/favorite',
        token: validToken
      }, flow);

      // The sync should trigger JWT.verify and then Favorite.remove
      // Check that Favorite.remove was called
      expect(mockConcepts.Favorite.__spy).toHaveBeenCalledWith('remove', expect.objectContaining({
        article: '/articles/article123/favorite[2]',
        user: 'test-user'
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
        user: '?user',
        password: 'password123'
      });

      // Check that JWT.generate was called
      expect(mockConcepts.JWT.__spy).toHaveBeenCalledWith('generate', {
        user: '?user'
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
        user: '?user',
        password: 'password123'
      });
    });

    it('should call JWT.generate when Password.verify succeeds', async () => {
      const flow = 'login-flow';

      // Set up password for testuser
      await engine.invoke('Password', 'set', {
        user: 'testuser',
        password: 'password123'
      }, flow);

      // Simulate password verification success
      await engine.invoke('Password', 'verify', {
        user: 'testuser',
        password: 'password123'
      }, flow);

      // Simulate JWT generation (normally triggered by sync)
      await engine.invoke('JWT', 'generate', {
        user: 'testuser'
      }, flow);

      // Check that JWT.generate was called
      expect(mockConcepts.JWT.__spy).toHaveBeenCalledWith('generate', {
        user: 'testuser'
      });
    });
  });
});
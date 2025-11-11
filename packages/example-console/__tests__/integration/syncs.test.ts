// Set required environment variables for tests
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-purposes-only';

import { LegibleEngine } from '@legible-sync/core';
import { User } from '../../src/concepts/User';
import { Article } from '../../src/concepts/Article';
import { Favorite } from '../../src/concepts/Favorite';
import { Comment } from '../../src/concepts/Comment';
import { Password } from '../../src/concepts/Password';
import { JWT } from '../../src/concepts/JWT';
import { Web } from '../../src/concepts/Web';
import { Persistence } from '../../src/concepts/Persistence';
import { articleSyncs } from '../../src/syncs/article.sync';
import { commentSyncs } from '../../src/syncs/comment.sync';
import { favoriteSyncs } from '../../src/syncs/favorite.sync';
import { registrationSyncs } from '../../src/syncs/registration.sync';
import { persistenceSyncs } from '../../src/syncs/persistence.sync';

// Helper to check if an action was executed
const wasActionExecuted = (engine: LegibleEngine, flow: string, concept: string, action: string, inputMatcher?: any) => {
  const actions = engine.getActionsByFlow(flow);
  return actions.some(a => {
    if (a.concept !== concept || a.action !== action) return false;
    if (inputMatcher) {
      return Object.entries(inputMatcher).every(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(a.input[key]) === JSON.stringify(value);
        }
        return a.input[key] === value;
      });
    }
    return true;
  });
};

describe('Sync Rules Integration Tests', () => {
  let engine: LegibleEngine;

  beforeEach(() => {
    engine = new LegibleEngine();

    // Register concepts
    engine.registerConcept('User', User);
    engine.registerConcept('Article', Article);
    engine.registerConcept('Favorite', Favorite);
    engine.registerConcept('Comment', Comment);
    engine.registerConcept('Password', Password);
    engine.registerConcept('JWT', JWT);
    engine.registerConcept('Web', Web);
    engine.registerConcept('Persistence', Persistence);

    // Register all syncs
    [...articleSyncs, ...commentSyncs, ...favoriteSyncs, ...registrationSyncs, ...persistenceSyncs]
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
    Comment.state.articleId.clear();
    Comment.state.authorId.clear();
    Comment.state.content.clear();
    Comment.state.createdAt.clear();
    Password.state.password.clear();
    Web.state.responses.clear();
    Persistence.state.triples.length = 0;

    // Reset engine state
    engine['firedSyncs'].clear();
    engine['invokedActions'].clear();
    engine['actions'].length = 0;
    engine['actionIndex'].clear();
  });

  describe('Article Syncs', () => {
    it('should call JWT.verify and Article.create when Web.request POST /articles with token', async () => {
      const flow = 'article-create-flow';

      // First generate a valid token
      const tokenResult = await engine.invoke('JWT', 'generate', { user: 'user123' }, flow);
      const validToken = tokenResult.token;

      // Simulate web request
      await engine.invoke('Web', 'request', {
        method: 'POST',
        path: '/articles',
        body: { title: 'Test Article', body: 'Test content' },
        token: validToken
      }, flow);

      // Wait for syncs to execute
      await new Promise(resolve => setTimeout(resolve, 10));

      // Check that JWT.verify was executed
      expect(wasActionExecuted(engine, flow, 'JWT', 'verify')).toBe(true);

      // Check that Article.create was executed
      expect(wasActionExecuted(engine, flow, 'Article', 'create')).toBe(true);
    });
  });

  describe('Comment Syncs', () => {
    it('should call JWT.verify and Comment.create when Web.request POST /articles/*/comments with token', async () => {
      const flow = 'comment-create-flow';

      // First generate a valid token
      const tokenResult = await engine.invoke('JWT', 'generate', { user: 'user123' }, flow);
      const validToken = tokenResult.token;

      // Simulate web request
      await engine.invoke('Web', 'request', {
        method: 'POST',
        path: '/articles/article123/comments',
        body: { body: 'Test comment' },
        token: validToken
      }, flow);

      // Wait for syncs to execute
      await new Promise(resolve => setTimeout(resolve, 10));

      // Check that JWT.verify was executed
      expect(wasActionExecuted(engine, flow, 'JWT', 'verify')).toBe(true);

      // Check that Comment.create was executed
      expect(wasActionExecuted(engine, flow, 'Comment', 'create')).toBe(true);
    });
  });

  describe('Favorite Syncs', () => {
    it('should call JWT.verify and Favorite.add when Web.request POST /articles/*/favorite with token', async () => {
      const flow = 'favorite-add-flow';

      // First generate a valid token
      const tokenResult = await engine.invoke('JWT', 'generate', { user: 'user123' }, flow);
      const validToken = tokenResult.token;

      // Simulate web request
      await engine.invoke('Web', 'request', {
        method: 'POST',
        path: '/articles/article123/favorite',
        token: validToken
      }, flow);

      // Wait for syncs to execute
      await new Promise(resolve => setTimeout(resolve, 10));

      // Check that JWT.verify was executed
      expect(wasActionExecuted(engine, flow, 'JWT', 'verify')).toBe(true);

      // Check that Favorite.add was executed
      expect(wasActionExecuted(engine, flow, 'Favorite', 'add')).toBe(true);
    });

    it('should call JWT.verify and Favorite.remove when Web.request DELETE /articles/*/favorite with token', async () => {
      const flow = 'favorite-remove-flow';

      // First generate a valid token
      const tokenResult = await engine.invoke('JWT', 'generate', { user: 'user123' }, flow);
      const validToken = tokenResult.token;

      // Simulate web request
      await engine.invoke('Web', 'request', {
        method: 'DELETE',
        path: '/articles/article123/favorite',
        token: validToken
      }, flow);

      // Wait for syncs to execute
      await new Promise(resolve => setTimeout(resolve, 10));

      // Check that JWT.verify was executed
      expect(wasActionExecuted(engine, flow, 'JWT', 'verify')).toBe(true);

      // Check that Favorite.remove was executed
      expect(wasActionExecuted(engine, flow, 'Favorite', 'remove')).toBe(true);
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

      // Wait for syncs to execute
      await new Promise(resolve => setTimeout(resolve, 10));

      // Check that Password.validate was executed
      expect(wasActionExecuted(engine, flow, 'Password', 'validate')).toBe(true);
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

      // Wait for syncs to execute
      await new Promise(resolve => setTimeout(resolve, 10));

      // Check that User.register was executed
      expect(wasActionExecuted(engine, flow, 'User', 'register')).toBe(true);
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

      // Wait for syncs to execute
      await new Promise(resolve => setTimeout(resolve, 10));

      // Check that Password.set was executed
      expect(wasActionExecuted(engine, flow, 'Password', 'set')).toBe(true);

      // Check that JWT.generate was executed
      expect(wasActionExecuted(engine, flow, 'JWT', 'generate')).toBe(true);
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

      // Wait for syncs to execute
      await new Promise(resolve => setTimeout(resolve, 10));

      // Check that Password.verify was executed
      expect(wasActionExecuted(engine, flow, 'Password', 'verify')).toBe(true);
    });

    it('should call JWT.generate when Password.verify succeeds', async () => {
      const flow = 'login-flow';

      // First set up a user with password
      await engine.invoke('Password', 'set', {
        user: 'testuser',
        password: 'password123'
      }, flow);

      // Simulate password verification success
      await engine.invoke('Password', 'verify', {
        user: 'testuser',
        password: 'password123'
      }, flow);

      // Wait for syncs to execute
      await new Promise(resolve => setTimeout(resolve, 10));

      // Check that JWT.generate was executed
      expect(wasActionExecuted(engine, flow, 'JWT', 'generate')).toBe(true);
    });
  });

  describe('Persistence Syncs', () => {
    it('should call Persistence.store multiple times when User.register succeeds', async () => {
      const flow = 'persistence-flow';

      // Simulate user registration with unique username
      await engine.invoke('User', 'register', {
        user: 'user456',
        username: 'uniqueuser',
        email: 'unique@example.com'
      }, flow);

      // Wait for syncs to execute
      await new Promise(resolve => setTimeout(resolve, 10));

      // Check that Persistence.store was called multiple times
      const actions = engine.getActionsByFlow(flow);
      const persistenceActions = actions.filter(a => a.concept === 'Persistence' && a.action === 'store');
      expect(persistenceActions.length).toBe(3); // registered, username, email
    });

    it('should call Persistence.store when Article.create succeeds', async () => {
      const flow = 'article-persistence-flow';

      // Simulate article creation
      await engine.invoke('Article', 'create', {
        article: 'article123',
        title: 'Test Article',
        body: 'Test content',
        author: 'user123'
      }, flow);

      // Wait for syncs to execute
      await new Promise(resolve => setTimeout(resolve, 10));

      // Check that Persistence.store was called for article data
      const actions = engine.getActionsByFlow(flow);
      const persistenceActions = actions.filter(a => a.concept === 'Persistence' && a.action === 'store');
      expect(persistenceActions.length).toBe(4); // created, title, author, slug
    });

    it('should call Persistence.store when Password.set succeeds', async () => {
      const flow = 'password-persistence-flow';

      // Simulate password set
      await engine.invoke('Password', 'set', {
        user: 'user123',
        password: 'hashedpassword'
      }, flow);

      // Wait for syncs to execute
      await new Promise(resolve => setTimeout(resolve, 10));

      // Check that Persistence.store was called
      expect(wasActionExecuted(engine, flow, 'Persistence', 'store')).toBe(true);
    });
  });
});
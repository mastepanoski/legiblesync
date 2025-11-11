import request from 'supertest';
// Set required environment variables for tests
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-purposes-only';

import express from 'express';
import { LegibleEngine } from '@legible-sync/core';
import { User } from '../../src/concepts/User';
import { Article } from '../../src/concepts/Article';
import { Favorite } from '../../src/concepts/Favorite';
import { Comment } from '../../src/concepts/Comment';
import { Password } from '../../src/concepts/Password';
import { JWT } from '../../src/concepts/JWT';
import { Web } from '../../src/concepts/Web';
import { registrationSyncs } from '../../src/syncs/registration.sync';
import { articleSyncs } from '../../src/syncs/article.sync';
import { favoriteSyncs } from '../../src/syncs/favorite.sync';
import { commentSyncs } from '../../src/syncs/comment.sync';
import { getFlowSummary } from '../../src/utils/audit';

// Set required environment variables for tests
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-purposes-only';

// Create test app
function createTestApp() {
  const app = express();
  app.use(express.json());

  const engine = new LegibleEngine();

  // Register concepts
  engine.registerConcept("User", User);
  engine.registerConcept("Article", Article);
  engine.registerConcept("Favorite", Favorite);
  engine.registerConcept("Comment", Comment);
  engine.registerConcept("Password", Password);
  engine.registerConcept("JWT", JWT);
  engine.registerConcept("Web", Web);

  // Register syncs
  registrationSyncs.forEach(s => engine.registerSync(s));
  articleSyncs.forEach(s => engine.registerSync(s));
  favoriteSyncs.forEach(s => engine.registerSync(s));
  commentSyncs.forEach(s => engine.registerSync(s));

  // Helper function to extract token
  function extractToken(req: express.Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }

  // Routes
  app.post('/users', async (req, res) => {
    try {
      const flow = `flow-${Date.now()}`;
      await engine.invoke("Web", "request", {
        method: "POST",
        path: "/users",
        body: req.body,
        token: null
      }, flow);

       const actions = engine.getActionsByFlow(flow);
       const jwtAction = actions.find(a => a.concept === 'JWT' && a.action === 'generate');

       if (jwtAction) {
         res.status(201).json({ token: jwtAction.output?.token });
       } else {
         res.status(400).json({ error: 'Invalid registration data' });
       }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/login', async (req, res) => {
    try {
      const flow = `flow-${Date.now()}`;
      await engine.invoke("Web", "request", {
        method: "POST",
        path: "/login",
        body: req.body,
        token: null
      }, flow);

      const actions = engine.getActionsByFlow(flow);
      const jwtAction = actions.find(a => a.concept === 'JWT' && a.action === 'generate');

      if (jwtAction) {
        res.json({ token: jwtAction.output?.token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  });

  app.post('/articles', async (req, res) => {
    try {
      const token = extractToken(req);
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const flow = `flow-${Date.now()}`;
      await engine.invoke("Web", "request", {
        method: "POST",
        path: "/articles",
        body: req.body,
        token
      }, flow);

       const actions = engine.getActionsByFlow(flow);
       const articleAction = actions.find(a => a.concept === 'Article' && a.action === 'create');

       if (articleAction) {
         res.status(201).json(articleAction.output);
       } else {
         res.status(400).json({ error: 'Article creation failed' });
       }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/articles/:articleId/favorite', async (req, res) => {
    try {
      const token = extractToken(req);
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const flow = `flow-${Date.now()}`;
      await engine.invoke("Web", "request", {
        method: "POST",
        path: `/articles/${req.params.articleId}/favorite`,
        body: req.body,
        token
      }, flow);

      res.json({ message: 'Article favorited successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/articles/:articleId/favorite', async (req, res) => {
    try {
      const token = extractToken(req);
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const flow = `flow-${Date.now()}`;
      await engine.invoke("Web", "request", {
        method: "DELETE",
        path: `/articles/${req.params.articleId}/favorite`,
        body: req.body,
        token
      }, flow);

      res.json({ message: 'Article unfavorited successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/articles/:articleId/comments', async (req, res) => {
    try {
      const token = extractToken(req);
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const flow = `flow-${Date.now()}`;
      await engine.invoke("Web", "request", {
        method: "POST",
        path: `/articles/${req.params.articleId}/comments`,
        body: req.body,
        token
      }, flow);

      res.status(201).json({ message: 'Comment created successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/audit/:flowId', async (req, res) => {
    try {
      const actions = engine.getActionsByFlow(req.params.flowId);
      const summary = getFlowSummary(engine, req.params.flowId);

      res.json({
        flowId: req.params.flowId,
        summary,
        actions: actions.map(action => ({
          id: action.id,
          concept: action.concept,
          action: action.action,
          input: action.input,
          output: action.output,
          syncEdges: action.syncEdges
        }))
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return app;
}

describe('Express API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('POST /users', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(201);

      expect(response.body.token).toBeDefined();
    });

    it('should return error for invalid data', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          username: '',
          email: 'invalid-email',
          password: '123'
        })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/users')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
    });

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: 'testuser',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
    });

    it('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  describe('POST /articles', () => {
    let token: string;

    beforeEach(async () => {
      const registerResponse = await request(app)
        .post('/users')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      token = registerResponse.body.token;
    });

    it('should create article with valid token', async () => {
      const response = await request(app)
        .post('/articles')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Article',
          content: 'This is a test article'
        })
        .expect(201);

      expect(response.body.articleId).toBeDefined();
      expect(response.body.article.title).toBe('Test Article');
    });

    it('should return error without token', async () => {
      const response = await request(app)
        .post('/articles')
        .send({
          title: 'Test Article',
          content: 'This is a test article'
        })
        .expect(401);

      expect(response.body.error).toBe('No token provided');
    });
  });

  describe('POST /articles/:articleId/favorite', () => {
    let token: string;
    let articleId: string;

    beforeEach(async () => {
      const registerResponse = await request(app)
        .post('/users')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      token = registerResponse.body.token;

      const articleResponse = await request(app)
        .post('/articles')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Article',
          content: 'This is a test article'
        });

      articleId = articleResponse.body.articleId;
    });

    it('should favorite article', async () => {
      const response = await request(app)
        .post(`/articles/${articleId}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toBe('Article favorited successfully');
    });

    it('should return error without token', async () => {
      const response = await request(app)
        .post(`/articles/${articleId}/favorite`)
        .expect(401);

      expect(response.body.error).toBe('No token provided');
    });
  });

  describe('GET /audit/:flowId', () => {
    it('should return audit data for flow', async () => {
      const flowId = 'test-flow-123';

      const response = await request(app)
        .get(`/audit/${flowId}`)
        .expect(200);

      expect(response.body.flowId).toBe(flowId);
      expect(response.body.summary).toBeDefined();
      expect(Array.isArray(response.body.actions)).toBe(true);
    });
  });
});
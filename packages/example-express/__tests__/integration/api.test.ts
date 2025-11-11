import request from 'supertest';
// Set required environment variables for tests
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-purposes-only';

import app from '../../src/server';
import { User } from '../../src/concepts/User';
import { Article } from '../../src/concepts/Article';
import { Favorite } from '../../src/concepts/Favorite';
import { Comment } from '../../src/concepts/Comment';
import { Password } from '../../src/concepts/Password';
import { JWT } from '../../src/concepts/JWT';
import { Web } from '../../src/concepts/Web';

describe('Express API', () => {
  beforeEach(() => {
    // Clear all concept states between tests
    User.state.users.clear();
    User.state.username.clear();
    User.state.email.clear();
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
    Comment.state.createdAt.clear();
    Password.state.password.clear();
    JWT.state.tokens.clear();
    Web.state.responses.clear();
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

      expect(response.body.error).toBe('Invalid password');
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
          body: 'This is a test article'
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
          body: 'This is a test article'
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
// server.ts
import express from 'express';
import { LegibleEngine } from '@legible-sync/core';
import { User } from './concepts/User';
import { Article } from './concepts/Article';
import { Favorite } from './concepts/Favorite';
import { Comment } from './concepts/Comment';
import { Password } from './concepts/Password';
import { JWT } from './concepts/JWT';
import { Web } from './concepts/Web';
import { registrationSyncs } from './syncs/registration.sync';
import { articleSyncs } from './syncs/article.sync';
import { favoriteSyncs } from './syncs/favorite.sync';
import { commentSyncs } from './syncs/comment.sync';
import { getFlowSummary } from './utils/audit';

const app = express();

// Middleware
app.use(express.json());

// Helper function to extract token from Authorization header
function extractToken(req: express.Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// Routes
app.post('/users', async (req, res) => {
  const engine = new LegibleEngine();
  engine.registerConcept("User", User);
  engine.registerConcept("Article", Article);
  engine.registerConcept("Favorite", Favorite);
  engine.registerConcept("Comment", Comment);
  engine.registerConcept("Password", Password);
  engine.registerConcept("JWT", JWT);
  engine.registerConcept("Web", Web);
  registrationSyncs.forEach(s => engine.registerSync(s));
  articleSyncs.forEach(s => engine.registerSync(s));
  favoriteSyncs.forEach(s => engine.registerSync(s));
  commentSyncs.forEach(s => engine.registerSync(s));
  try {
    const flow = `flow-${Date.now()}`;
    await engine.invoke("Web", "request", {
      method: "POST",
      path: "/users",
      body: req.body,
      token: null
    }, flow);

    // Get the JWT token from the actions
    const actions = engine.getActionsByFlow(flow);
    console.log('[POST /users] All actions in flow:', actions);
    const registerAction = actions.find(a => a.concept === 'User' && a.action === 'register');
    console.log('[POST /users] User.register action:', registerAction);
    if (registerAction && registerAction.output?.error) {
      throw new Error(registerAction.output.error);
    }
    const jwtAction = actions.find(a => a.concept === 'JWT' && a.action === 'generate');

    if (jwtAction && jwtAction.output?.token) {
      res.status(201).json({ token: jwtAction.output.token });
    } else {
      // This case should ideally not be reached if registration and JWT generation syncs are correct
      res.status(201).json({ message: 'User registered successfully' });
    }
  } catch (error: any) {
    // Catch errors from engine.invoke (e.g., validation errors from Password concept)
    res.status(400).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const engine = new LegibleEngine();
  engine.registerConcept("User", User);
  engine.registerConcept("Article", Article);
  engine.registerConcept("Favorite", Favorite);
  engine.registerConcept("Comment", Comment);
  engine.registerConcept("Password", Password);
  engine.registerConcept("JWT", JWT);
  engine.registerConcept("Web", Web);
  registrationSyncs.forEach(s => engine.registerSync(s));
  articleSyncs.forEach(s => engine.registerSync(s));
  favoriteSyncs.forEach(s => engine.registerSync(s));
  commentSyncs.forEach(s => engine.registerSync(s));
  try {
    const flow = `flow-${Date.now()}`;
    await engine.invoke("Web", "request", {
      method: "POST",
      path: "/login",
      body: req.body,
      token: null
    }, flow);

    // Get the JWT token from the actions
    const actions = engine.getActionsByFlow(flow);
    console.log('[POST /login] All actions in flow:', actions);
    const verifyAction = actions.find(a => a.concept === 'Password' && a.action === 'verify');
    console.log('[POST /login] Password.verify action:', verifyAction);
    if (verifyAction && verifyAction.output?.error) {
      throw new Error(verifyAction.output.error);
    }
    const jwtAction = actions.find(a => a.concept === 'JWT' && a.action === 'generate');

    if (jwtAction && jwtAction.output?.token) {
      res.json({ token: jwtAction.output.token });
    } else {
      // This case should ideally not be reached if login is successful and JWT generation syncs are correct
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error: any) {
    // Catch errors from engine.invoke (e.g., validation errors from Password concept)
    res.status(401).json({ error: error.message });
  }
});

app.post('/articles', async (req, res) => {
  const engine = new LegibleEngine();
  engine.registerConcept("User", User);
  engine.registerConcept("Article", Article);
  engine.registerConcept("Favorite", Favorite);
  engine.registerConcept("Comment", Comment);
  engine.registerConcept("Password", Password);
  engine.registerConcept("JWT", JWT);
  engine.registerConcept("Web", Web);
  registrationSyncs.forEach(s => engine.registerSync(s));
  articleSyncs.forEach(s => engine.registerSync(s));
  favoriteSyncs.forEach(s => engine.registerSync(s));
  commentSyncs.forEach(s => engine.registerSync(s));
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

    // Get the article creation result
    const actions = engine.getActionsByFlow(flow);
    const articleAction = actions.find(a => a.concept === 'Article' && a.action === 'create');

    if (articleAction && articleAction.output) {
      res.status(201).json(articleAction.output);
    } else {
      res.status(201).json({ message: 'Article created successfully' });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/articles/:articleId/favorite', async (req, res) => {
  const engine = new LegibleEngine();
  engine.registerConcept("User", User);
  engine.registerConcept("Article", Article);
  engine.registerConcept("Favorite", Favorite);
  engine.registerConcept("Comment", Comment);
  engine.registerConcept("Password", Password);
  engine.registerConcept("JWT", JWT);
  engine.registerConcept("Web", Web);
  registrationSyncs.forEach(s => engine.registerSync(s));
  articleSyncs.forEach(s => engine.registerSync(s));
  favoriteSyncs.forEach(s => engine.registerSync(s));
  commentSyncs.forEach(s => engine.registerSync(s));
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
  const engine = new LegibleEngine();
  engine.registerConcept("User", User);
  engine.registerConcept("Article", Article);
  engine.registerConcept("Favorite", Favorite);
  engine.registerConcept("Comment", Comment);
  engine.registerConcept("Password", Password);
  engine.registerConcept("JWT", JWT);
  engine.registerConcept("Web", Web);
  registrationSyncs.forEach(s => engine.registerSync(s));
  articleSyncs.forEach(s => engine.registerSync(s));
  favoriteSyncs.forEach(s => engine.registerSync(s));
  commentSyncs.forEach(s => engine.registerSync(s));
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
  const engine = new LegibleEngine();
  engine.registerConcept("User", User);
  engine.registerConcept("Article", Article);
  engine.registerConcept("Favorite", Favorite);
  engine.registerConcept("Comment", Comment);
  engine.registerConcept("Password", Password);
  engine.registerConcept("JWT", JWT);
  engine.registerConcept("Web", Web);
  registrationSyncs.forEach(s => engine.registerSync(s));
  articleSyncs.forEach(s => engine.registerSync(s));
  favoriteSyncs.forEach(s => engine.registerSync(s));
  commentSyncs.forEach(s => engine.registerSync(s));
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

// Audit endpoint
app.get('/audit/:flowId', async (req, res) => {
  const engine = new LegibleEngine();
  engine.registerConcept("User", User);
  engine.registerConcept("Article", Article);
  engine.registerConcept("Favorite", Favorite);
  engine.registerConcept("Comment", Comment);
  engine.registerConcept("Password", Password);
  engine.registerConcept("JWT", JWT);
  engine.registerConcept("Web", Web);
  registrationSyncs.forEach(s => engine.registerSync(s));
  articleSyncs.forEach(s => engine.registerSync(s));
  favoriteSyncs.forEach(s => engine.registerSync(s));
  commentSyncs.forEach(s => engine.registerSync(s));
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

export default app;
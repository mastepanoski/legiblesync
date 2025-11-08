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
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize engine
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
    const jwtAction = actions.find(a => a.concept === 'JWT' && a.action === 'generate');

    if (jwtAction) {
      res.status(201).json({ token: jwtAction.output?.token });
    } else {
      res.status(201).json({ message: 'User registered successfully' });
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

    // Get the JWT token from the actions
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

    // Get the article creation result
    const actions = engine.getActionsByFlow(flow);
    const articleAction = actions.find(a => a.concept === 'Article' && a.action === 'create');

    if (articleAction) {
      res.status(201).json(articleAction.output);
    } else {
      res.status(201).json({ message: 'Article created successfully' });
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

// Audit endpoint
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

app.listen(port, () => {
  console.log(`WYSIWID Legible Software Express server running on port ${port}`);
});
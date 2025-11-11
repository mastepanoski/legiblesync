// syncs/article.sync.ts
import { SyncRule } from '@legible-sync/core';

export const articleSyncs: SyncRule[] = [
  {
    name: "VerifyTokenForArticles",
    when: [
      {
        concept: "Web",
        action: "request",
        input: { method: "POST", path: "/articles" }
      }
    ],
    then: [
      {
        concept: "JWT",
        action: "verify",
        input: { token: "?token" }
      }
    ]
  },
  {
    name: "CreateArticle",
    when: [
      {
        concept: "Web",
        action: "request",
        input: { method: "POST", path: "/articles" }
      },
      {
        concept: "JWT",
        action: "verify",
        output: { user: "?user" }
      }
    ],
    then: [
      {
        concept: "Article",
        action: "create",
        input: {
          article: "uuid()",
          title: "?body.title",
          body: "?body.body",
          author: "?user"
        }
      }
    ]
  }
];
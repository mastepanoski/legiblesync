// syncs/article.sync.ts
import { SyncRule } from '@legible-sync/core';

export const articleSyncs: SyncRule[] = [
  {
    name: "CreateArticle",
    when: [
      {
        concept: "Web",
        action: "request",
        input: { method: "POST", path: "/articles" },
        output: { request: "?req" }
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
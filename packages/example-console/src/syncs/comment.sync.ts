// syncs/comment.sync.ts
import { SyncRule } from '@legible-sync/core';

export const commentSyncs: SyncRule[] = [
  {
    name: "CreateComment",
    when: [
      {
        concept: "Web",
        action: "request",
        input: { method: "POST", path: "/articles/*/comments" },
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
        concept: "Comment",
        action: "create",
        input: {
          comment: "uuid()",
          article: "?path[1]", // Extract article ID from path
          author: "?user",
          body: "?body.body"
        }
      }
    ]
  }
];
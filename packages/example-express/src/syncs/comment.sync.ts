// syncs/comment.sync.ts
import { SyncRule } from '@legible-sync/core';

export const commentSyncs: SyncRule[] = [
  {
    name: "VerifyTokenForComments",
    when: [
      {
        concept: "Web",
        action: "request",
        input: { method: "POST", path: "/articles/*/comments" },
        output: { request: "?req" }
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
          article: "?path[2]", // Extract article ID from path
          author: "?user",
          body: "?body.body"
        }
      }
    ]
  }
];
// syncs/comment.sync.ts
import { SyncRule } from '@legible-sync/core';

export const commentSyncs: SyncRule[] = [
  {
    name: "VerifyTokenForComments",
    when: [
      {
        concept: "Web",
        action: "request",
        input: { method: "POST", path: "/articles/*/comments" }
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
        input: { method: "POST", path: "/articles/*/comments" }
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
           articleId: "?path[1]", // Extract article ID from path
           authorId: "?user",
           content: "?body.body"
         }
       }
     ]
  }
];
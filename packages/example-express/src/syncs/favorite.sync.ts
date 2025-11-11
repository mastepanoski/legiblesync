// syncs/favorite.sync.ts
import { SyncRule } from '@legible-sync/core';

export const favoriteSyncs: SyncRule[] = [
  {
    name: "VerifyTokenForAddFavorite",
    when: [
      {
        concept: "Web",
        action: "request",
        input: { method: "POST", path: "/articles/*/favorite" },
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
    name: "AddFavorite",
    when: [
      {
        concept: "Web",
        action: "request",
        input: { method: "POST", path: "/articles/*/favorite" },
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
        concept: "Favorite",
        action: "add",
        input: {
          article: "?path[2]", // Extract article ID from path
          user: "?user"
        }
      }
    ]
  },
  {
    name: "VerifyTokenForRemoveFavorite",
    when: [
      {
        concept: "Web",
        action: "request",
        input: { method: "DELETE", path: "/articles/*/favorite" },
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
    name: "RemoveFavorite",
    when: [
      {
        concept: "Web",
        action: "request",
        input: { method: "DELETE", path: "/articles/*/favorite" },
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
        concept: "Favorite",
        action: "remove",
        input: {
          article: "?path[2]", // Extract article ID from path
          user: "?user"
        }
      }
    ]
  }
];
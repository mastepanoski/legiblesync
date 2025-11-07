// syncs/favorite.sync.ts
import { SyncRule } from '@legible-sync/core';

export const favoriteSyncs: SyncRule[] = [
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
          article: "?path[1]", // Extract article ID from path
          user: "?user"
        }
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
          article: "?path[1]", // Extract article ID from path
          user: "?user"
        }
      }
    ]
  }
];
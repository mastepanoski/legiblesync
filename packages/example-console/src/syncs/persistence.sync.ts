// syncs/persistence.sync.ts
import { SyncRule } from '@legible-sync/core';

export const persistenceSyncs: SyncRule[] = [
  {
    name: "PersistUserRegistration",
    when: [
      {
        concept: "User",
        action: "register"
      }
    ],
    then: [
      {
        concept: "Persistence",
        action: "store",
        input: {
          subject: "user_?user",
          predicate: "registered",
          object: "true"
        }
      },
      {
        concept: "Persistence",
        action: "store",
        input: {
          subject: "user_?user",
          predicate: "username",
          object: "?username"
        }
      },
      {
        concept: "Persistence",
        action: "store",
        input: {
          subject: "user_?user",
          predicate: "email",
          object: "?email"
        }
      }
    ]
  },
  {
    name: "PersistArticleCreation",
    when: [
      {
        concept: "Article",
        action: "create"
      }
    ],
    then: [
      {
        concept: "Persistence",
        action: "store",
        input: {
          subject: "article_?article",
          predicate: "created",
          object: "true"
        }
      },
      {
        concept: "Persistence",
        action: "store",
        input: {
          subject: "article_?article",
          predicate: "title",
          object: "?title"
        }
      },
      {
        concept: "Persistence",
        action: "store",
        input: {
          subject: "article_?article",
          predicate: "author",
          object: "?author"
        }
      },
      {
        concept: "Persistence",
        action: "store",
        input: {
          subject: "article_?article",
          predicate: "slug",
          object: "?slug"
        }
      }
    ]
  },
  {
    name: "PersistPasswordSet",
    when: [
      {
        concept: "Password",
        action: "set"
      }
    ],
    then: [
      {
        concept: "Persistence",
        action: "store",
        input: {
          subject: "user_?user",
          predicate: "hasPassword",
          object: "true"
        }
      }
    ]
  }
];
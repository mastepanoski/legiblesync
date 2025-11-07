// syncs/registration.sync.ts
import { SyncRule } from '@legible-sync/core';

export const registrationSyncs: SyncRule[] = [
  {
    name: "StartRegistration",
    when: [
      {
        concept: "Web",
        action: "request",
        input: { method: "POST", path: "/users" },
        output: { request: "?req" }
      }
    ],
    then: [
      {
        concept: "User",
        action: "register",
        input: {
          user: "uuid()",
          username: "?body.username",
          email: "?body.email"
        }
      }
    ]
  },
  {
    name: "ValidatePasswordFirst",
    when: [
      {
        concept: "Web",
        action: "request",
        input: { method: "POST", path: "/users" },
        output: { request: "?req" }
      }
    ],
    then: [
      {
        concept: "Password",
        action: "validate",
        input: { password: "?body.password" }
      }
    ]
  },
  {
    name: "RegisterOnValidPassword",
    when: [
      {
        concept: "Web",
        action: "request",
        output: {}
      },
      {
        concept: "Password",
        action: "validate",
        output: { valid: true }
      },
      {
        concept: "User",
        action: "register",
        output: { user: "?user" }
      }
    ],
    then: [
      {
        concept: "Password",
        action: "set",
        input: { user: "?user", password: "?body.password" }
      },
      {
        concept: "JWT",
        action: "generate",
        input: { user: "?user" }
      }
    ]
  },
  {
    name: "LoginUser",
    when: [
      {
        concept: "Web",
        action: "request",
        input: { method: "POST", path: "/login" },
        output: { request: "?req" }
      }
    ],
    then: [
      {
        concept: "Password",
        action: "verify",
        input: { user: "?body.username", password: "?body.password" }
      },
      {
        concept: "JWT",
        action: "generate",
        input: { user: "?body.username" }
      }
    ]
  }
];
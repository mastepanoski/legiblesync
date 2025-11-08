// syncs/registration.sync.ts
import { SyncRule } from '@legible-sync/core';

export const registrationSyncs: SyncRule[] = [
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
        input: { method: "POST", path: "/users" },
        output: { request: "?req" }
      },
      {
        concept: "Password",
        action: "validate",
        output: {}
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
      },
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
        concept: "User",
        action: "getByUsername",
        input: { username: "?body.username" }
      },
      {
        concept: "Password",
        action: "verify",
        input: { user: "?user", password: "?body.password" }
      },
      {
        concept: "JWT",
        action: "generate",
        input: { user: "?user" }
      }
    ]
  }
];
// syncs/registration.sync.ts
import { SyncRule } from '@legible-sync/core';

export const registrationSyncs: SyncRule[] = [
  {
    name: "HandleRegistration",
    when: [
      {
        concept: "Web",
        action: "request",
        input: { method: "POST", path: "/users" }
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
    name: "RegisterUserAfterValidation",
    when: [
      {
        concept: "Password",
        action: "validate",
        output: { valid: true }
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
    name: "CompleteRegistrationAfterUser",
    when: [
      {
        concept: "User",
        action: "register"
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
    name: "HandleLogin",
    when: [
      {
        concept: "Web",
        action: "request",
        input: { method: "POST", path: "/login" }
      }
    ],
    then: [
      {
        concept: "Password",
        action: "verify",
        input: { user: "?body.username", password: "?body.password" }
      }
    ]
  },
  {
    name: "GenerateTokenAfterLogin",
    when: [
      {
        concept: "Password",
        action: "verify"
      }
    ],
    then: [
      {
        concept: "JWT",
        action: "generate",
        input: { user: "?user" }
      }
    ]
  }
];
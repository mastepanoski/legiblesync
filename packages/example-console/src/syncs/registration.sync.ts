// syncs/registration.sync.ts
import { SyncRule, Query, Invocation } from '@legible-sync/core';

/**
 * Example demonstrating Query and Invocation usage:
 *
 * Query allows filtering bindings before executing Invocations.
 * Invocation is the new type for then clauses (same structure as before).
 */
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
         concept: "Web",
         action: "request",
         input: { method: "POST", path: "/users" }
       },
       {
         concept: "User",
         action: "register"
       }
     ],
     where: {
       filter: (bindings) => {
         // Only complete registration for users with valid email
         const email = bindings.email as string;
         return typeof email === 'string' && email.includes('@');
       }
     },
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
  // Example sync rule demonstrating Query usage
  {
    name: "FilteredUserNotification",
    when: [
      {
        concept: "User",
        action: "register"
      }
    ],
    where: {
      filter: (bindings) => {
        // Only send notifications for premium users (example filter)
        const email = bindings.email as string;
        return typeof email === 'string' && email.endsWith('@premium.com');
      }
    } as Query,
    then: [
      {
        concept: "Web",
        action: "respond",
        input: {
          request: "?request",
          code: 200,
          body: { message: "Welcome premium user: ?username" }
        }
      }
    ] as Invocation[]
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
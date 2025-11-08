// plugins/users/syncs/user-events.sync.ts
import { SyncRule } from '@legible-sync/core';

export const userEventSyncs: SyncRule[] = [
  // When a user registers, publish user.registered event
  {
    name: "PublishUserRegisteredEvent",
    when: [
      {
        concept: "User",
        action: "register"
      }
    ],
    then: [
      {
        concept: "EventBus",
        action: "publish",
        input: {
          event: "user.registered",
          data: {
            userId: "?userId",
            username: "?user.username",
            email: "?user.email"
          }
        }
      }
    ]
  },

  // When a user is updated, publish user.updated event
  {
    name: "PublishUserUpdatedEvent",
    when: [
      {
        concept: "User",
        action: "update"
      }
    ],
    then: [
      {
        concept: "EventBus",
        action: "publish",
        input: {
          event: "user.updated",
          data: {
            userId: "?userId",
            updates: "?updates"
          }
        }
      }
    ]
  },

  // When a user is deactivated, publish user.deactivated event
  {
    name: "PublishUserDeactivatedEvent",
    when: [
      {
        concept: "User",
        action: "deactivate"
      }
    ],
    then: [
      {
        concept: "EventBus",
        action: "publish",
        input: {
          event: "user.deactivated",
          data: {
            userId: "?userId"
          }
        }
      }
    ]
  }
];
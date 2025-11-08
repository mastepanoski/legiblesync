// plugins/analytics/syncs/analytics-events.sync.ts
import { SyncRule } from '@legible-sync/core';

export const analyticsEventSyncs: SyncRule[] = [
  // Track user registration events
  {
    name: "TrackUserRegistration",
    when: [
      {
        concept: "User",
        action: "register"
      }
    ],
    then: [
      {
        concept: "Analytics",
        action: "track",
        input: {
          event: "user_registered",
          data: {
            userId: "?userId",
            username: "?username",
            email: "?email"
          }
        }
      }
    ]
  },

  // Track product creation events
  {
    name: "TrackProductCreation",
    when: [
      {
        concept: "Product",
        action: "create"
      }
    ],
    then: [
      {
        concept: "Analytics",
        action: "track",
        input: {
          event: "product_created",
          data: {
            productId: "?productId",
            name: "?name",
            category: "?category",
            price: "?price"
          }
        }
      }
    ]
  },

  // Track order events
  {
    name: "TrackOrderCreation",
    when: [
      {
        concept: "Order",
        action: "create"
      }
    ],
    then: [
      {
        concept: "Analytics",
        action: "track",
        input: {
          event: "order_created",
          data: {
            orderId: "?orderId",
            userId: "?userId",
            itemCount: "?items.length"
          }
        }
      }
    ]
  },

  {
    name: "TrackOrderConfirmation",
    when: [
      {
        concept: "Order",
        action: "confirm"
      }
    ],
    then: [
      {
        concept: "Analytics",
        action: "track",
        input: {
          event: "order_confirmed",
          data: {
            orderId: "?orderId",
            total: "?total"
          }
        }
      }
    ]
  }
];
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
            username: "?user.username",
            email: "?user.email"
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
            name: "?product.name",
            category: "?product.category",
            price: "?product.price"
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
            userId: "?order.userId",
            itemCount: "?order.items.length"
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
            total: "?order.total"
          }
        }
      }
    ]
  }
];
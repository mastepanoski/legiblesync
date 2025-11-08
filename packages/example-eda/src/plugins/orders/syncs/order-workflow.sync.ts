// plugins/orders/syncs/order-workflow.sync.ts
import { SyncRule } from '@legible-sync/core';

export const orderWorkflowSyncs: SyncRule[] = [
  // After order creation, check inventory availability
  {
    name: "CheckInventoryAfterOrderCreation",
    when: [
      {
        concept: "Order",
        action: "create"
      }
    ],
    then: [
      {
        concept: "Inventory",
        action: "checkAvailability",
        input: {
          orderId: "?orderId",
          items: "?order.items"
        }
      }
    ]
  },

  // If inventory is available, confirm the order
  {
    name: "ConfirmOrderIfInventoryAvailable",
    when: [
      {
        concept: "Inventory",
        action: "checkAvailability"
      }
    ],
    where: {
      filter: (bindings) => bindings.available === true
    },
    then: [
      {
        concept: "Order",
        action: "confirm",
        input: {
          orderId: "?orderId",
          total: "?total"
        }
      }
    ]
  },

  // After order confirmation, get user details for notifications
  {
    name: "GetUserDetailsAfterOrderConfirm",
    when: [
      {
        concept: "Order",
        action: "confirm"
      }
    ],
    then: [
      {
        concept: "User",
        action: "get",
        input: {
          userId: "?order.userId"
        }
      }
    ]
  },

  // If inventory is not available, cancel the order
  {
    name: "CancelOrderIfInventoryUnavailable",
    when: [
      {
        concept: "Inventory",
        action: "checkAvailability"
      }
    ],
    where: {
      filter: (bindings) => bindings.available === false
    },
    then: [
      {
        concept: "Order",
        action: "cancel",
        input: {
          orderId: "?orderId"
        }
      }
    ]
  },

  // When order is confirmed, deduct inventory
  {
    name: "DeductInventoryOnOrderConfirm",
    when: [
      {
        concept: "Order",
        action: "confirm"
      }
    ],
    then: [
      {
        concept: "Inventory",
        action: "deduct",
        input: {
          orderId: "?orderId",
          items: "?order.items"
        }
      }
    ]
  },

  // When user details are retrieved after order confirmation, send notification
  {
    name: "SendOrderConfirmationNotification",
    when: [
      {
        concept: "Order",
        action: "confirm"
      },
      {
        concept: "User",
        action: "get"
      }
    ],
    where: {
      filter: (bindings) => bindings.order.userId === bindings.user.id
    },
    then: [
      {
        concept: "Notification",
        action: "send",
        input: {
          type: "email",
          to: "?user.email",
          template: "order-confirmation",
          data: {
            orderId: "?order.id",
            total: "?order.total",
            items: "?order.items"
          }
        }
      }
    ]
  },

  // When order is shipped, send shipping notification
  {
    name: "SendShippingNotification",
    when: [
      {
        concept: "Order",
        action: "ship"
      }
    ],
    then: [
      {
        concept: "Notification",
        action: "send",
        input: {
          type: "email",
          to: "?user.email",
          template: "order-shipped",
          data: {
            orderId: "?orderId",
            trackingNumber: "?order.trackingNumber"
          }
        }
      }
    ]
  }
];
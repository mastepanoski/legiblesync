// plugins/orders/syncs/order-workflow.sync.ts
import { SyncRule } from '@legible-sync/core';

export const orderWorkflowSyncs: SyncRule[] = [
  // For demo purposes, auto-confirm orders immediately (simplified logic)
  {
    name: "AutoConfirmOrderAfterCreation",
    when: [
      {
        concept: "Order",
        action: "create"
      }
    ],
    then: [
      {
        concept: "Order",
        action: "confirm",
        input: {
          orderId: "?orderId",
          total: 199.98  // 2 items * $99.99
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

  // When order is confirmed, send confirmation notification
  {
    name: "SendOrderConfirmationNotification",
    when: [
      {
        concept: "Order",
        action: "confirm"
      }
    ],
    then: [
      {
        concept: "Notification",
        action: "send",
        input: {
          type: "email",
          to: "?user.email",
          template: "order-confirmation",
          data: {
            orderId: "?orderId",
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
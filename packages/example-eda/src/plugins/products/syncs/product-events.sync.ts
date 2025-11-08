// plugins/products/syncs/product-events.sync.ts
import { SyncRule } from '@legible-sync/core';

export const productEventSyncs: SyncRule[] = [
  // When a product is created, publish product.created event
  {
    name: "PublishProductCreatedEvent",
    when: [
      {
        concept: "Product",
        action: "create"
      }
    ],
    then: [
      {
        concept: "EventBus",
        action: "publish",
        input: {
          event: "product.created",
          data: {
            productId: "?productId",
            name: "?product.name",
            sku: "?product.sku",
            price: "?product.price",
            category: "?product.category"
          }
        }
      }
    ]
  },

  // When a product is updated, publish product.updated event
  {
    name: "PublishProductUpdatedEvent",
    when: [
      {
        concept: "Product",
        action: "update"
      }
    ],
    then: [
      {
        concept: "EventBus",
        action: "publish",
        input: {
          event: "product.updated",
          data: {
            productId: "?productId",
            updates: "?updates"
          }
        }
      }
    ]
  },

  // When a product is deactivated, publish product.deactivated event
  {
    name: "PublishProductDeactivatedEvent",
    when: [
      {
        concept: "Product",
        action: "deactivate"
      }
    ],
    then: [
      {
        concept: "EventBus",
        action: "publish",
        input: {
          event: "product.deactivated",
          data: {
            productId: "?productId"
          }
        }
      }
    ]
  }
];
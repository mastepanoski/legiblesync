// plugins/inventory/concepts/Inventory.ts
import { Concept } from '@legible-sync/core';

export const Inventory: Concept = {
  state: {
    stock: new Map<string, number>(),
    reservations: new Map<string, any[]>(),
  },

  async execute(action: string, input: any) {
    const state = this.state;

    switch (action) {
      case 'setStock': {
        const { productId, quantity } = input;

        if (!productId || quantity < 0) {
          throw new Error('Valid productId and non-negative quantity required');
        }

        state.stock.set(productId, quantity);
        return { productId, quantity };
      }

      case 'checkAvailability': {
        const { orderId, items } = input;

        let total = 0;
        const unavailable: any[] = [];

        for (const item of items) {
          const stock = state.stock.get(item.productId) || 0;
          if (stock < item.quantity) {
            unavailable.push({
              productId: item.productId,
              requested: item.quantity,
              available: stock
            });
          }
          // Calculate total from input items (prices should be provided)
          total += item.quantity * (item.price || 0);
        }

        const available = unavailable.length === 0;
        return { available, total, unavailable };
      }

      case 'deduct': {
        const { orderId, items } = input;

        for (const item of items) {
          const currentStock = state.stock.get(item.productId) || 0;
          if (currentStock < item.quantity) {
            throw new Error(`Insufficient stock for product ${item.productId}`);
          }

          state.stock.set(item.productId, currentStock - item.quantity);
        }

        return { success: true };
      }

      case 'getStock': {
        const { productId } = input;
        const quantity = state.stock.get(productId) || 0;
        return { productId, quantity };
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
};
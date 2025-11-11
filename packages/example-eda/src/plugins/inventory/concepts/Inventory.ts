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
          console.log(`[Inventory.checkAvailability] Processing item: productId=${item.productId}, quantity=${item.quantity}, price=${item.price}`);
          const parsedQuantity = parseFloat(item.quantity) || 0;
          console.log(`[Inventory.checkAvailability] Parsed quantity: ${parsedQuantity}`);
          const parsedPrice = parseFloat(item.price) || 0;
          console.log(`[Inventory.checkAvailability] Parsed price: ${parsedPrice}`);
          const stock = state.stock.get(item.productId) || 0;
          if (stock < parsedQuantity) {
            unavailable.push({
              productId: item.productId,
              requested: parsedQuantity,
              available: stock
            });
          }
          // Calculate total from input items (prices should be provided)
          total += parsedQuantity * parsedPrice;
        }

        const available = unavailable.length === 0;
        return { available, total, unavailable };
      }

      case 'deduct': {
        const { orderId, items } = input;

        for (const item of items) {
          const parsedQuantity = parseFloat(item.quantity) || 0;
          const currentStock = state.stock.get(item.productId) || 0;
          if (currentStock < parsedQuantity) {
            throw new Error(`Insufficient stock for product ${item.productId}`);
          }

          state.stock.set(item.productId, currentStock - parsedQuantity);
        }

        return { success: true };
      }

      case 'getStock': {
        const { productId } = input;
        const quantity = state.stock.get(productId) || 0;
        return { productId, quantity };
      }

      case 'reset': {
        state.stock.clear();
        return { reset: true };
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
};
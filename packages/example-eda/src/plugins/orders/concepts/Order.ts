// plugins/orders/concepts/Order.ts
import { Concept } from '@legible-sync/core';
import { v4 as uuidv4 } from 'uuid';

export const Order: Concept = {
  state: {
    orders: new Map<string, any>(),
    orderItems: new Map<string, any[]>(),
  },

  async execute(action: string, input: any) {
    const state = this.state;

    switch (action) {
      case 'create': {
        const { userId, items } = input;

        // Validation
        if (!userId || !items || !Array.isArray(items) || items.length === 0) {
          throw new Error('User ID and items array are required');
        }

        // Validate items
        for (const item of items) {
          if (!item.productId || !item.quantity || item.quantity <= 0) {
            throw new Error('Each item must have productId and positive quantity');
          }
        }

        // Create order
        const orderId = uuidv4();
        const order = {
          id: orderId,
          userId,
          status: 'pending',
          total: 0, // Will be calculated after inventory check
          createdAt: new Date(),
          items: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price || 0
          }))
        };

        state.orders.set(orderId, order);
        state.orderItems.set(orderId, order.items);

        return { orderId, order };
      }

      case 'confirm': {
        const { orderId, total } = input;
        const order = state.orders.get(orderId);
        if (!order) {
          throw new Error('Order not found');
        }

        if (order.status !== 'pending') {
          throw new Error('Order is not in pending status');
        }

        order.status = 'confirmed';
        order.total = total;
        order.confirmedAt = new Date();
        state.orders.set(orderId, order);

        return { order };
      }

      case 'cancel': {
        const { orderId } = input;
        const order = state.orders.get(orderId);
        if (!order) {
          throw new Error('Order not found');
        }

        order.status = 'cancelled';
        order.cancelledAt = new Date();
        state.orders.set(orderId, order);

        return { order };
      }

      case 'ship': {
        const { orderId, trackingNumber } = input;
        const order = state.orders.get(orderId);
        if (!order) {
          throw new Error('Order not found');
        }

        if (order.status !== 'confirmed') {
          throw new Error('Order must be confirmed before shipping');
        }

        order.status = 'shipped';
        order.trackingNumber = trackingNumber;
        order.shippedAt = new Date();
        state.orders.set(orderId, order);

        return { order };
      }

      case 'get': {
        const { orderId } = input;
        const order = state.orders.get(orderId);
        if (!order) {
          throw new Error('Order not found');
        }

        const items = state.orderItems.get(orderId) || [];
        return { order: { ...order, items } };
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
};
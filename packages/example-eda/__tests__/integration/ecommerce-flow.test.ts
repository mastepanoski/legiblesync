import { LegibleEngine } from '@legible-sync/core';
import { PluginManager } from '../../src/core/PluginManager';
import { EventBus } from '../../src/core/EventBus';
import { usersPlugin } from '../../src/plugins/users';
import { productsPlugin } from '../../src/plugins/products';
import { ordersPlugin } from '../../src/plugins/orders';
import { inventoryPlugin } from '../../src/plugins/inventory';
import { notificationsPlugin } from '../../src/plugins/notifications';
import { analyticsPlugin } from '../../src/plugins/analytics';
import { paymentsPlugin } from '../../src/plugins/payments';

describe('E-commerce Flow Integration', () => {
  let engine: LegibleEngine;
  let pluginManager: PluginManager;
  let eventBus: EventBus;

  beforeEach(async () => {
    engine = new LegibleEngine();
    pluginManager = new PluginManager(engine);
    eventBus = new EventBus();

    // Register EventBus as a concept
    engine.registerConcept('EventBus', {
      state: {},
      async execute(action: string, input: any) {
        if (action === 'publish') {
          const { event, data } = input;
          await eventBus.publish({
            type: event,
            payload: data,
            source: 'system',
            flowId: input.flowId || 'system'
          });
          return { published: true };
        }
        throw new Error(`Unknown EventBus action: ${action}`);
      }
    });

    // Load all plugins
    await pluginManager.loadPlugin(usersPlugin);
    await pluginManager.loadPlugin(productsPlugin);
    await pluginManager.loadPlugin(inventoryPlugin);
    await pluginManager.loadPlugin(ordersPlugin);
    await pluginManager.loadPlugin(paymentsPlugin);
    await pluginManager.loadPlugin(notificationsPlugin);
    await pluginManager.loadPlugin(analyticsPlugin);

    // Reset concept states for test isolation
    await engine.invoke('User', 'reset', {}, 'reset');
    await engine.invoke('Product', 'reset', {}, 'reset');
  });

  describe('Complete User Registration Flow', () => {
    it('should handle user registration with analytics tracking', async () => {
      const flowId = 'user-reg-flow';

      const result = await engine.invoke('User', 'register', {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      }, flowId);

      expect(result.userId).toBeDefined();
      expect(result.user.username).toBe('johndoe');
      expect(result.user.email).toBe('john@example.com');

      // Check analytics tracking
      const analytics = await engine.invoke('Analytics', 'getMetrics', {}, 'analytics-check');
      expect(analytics.metrics['user_registered']).toBe(1);
    });
  });

  describe('Complete Product Management Flow', () => {
    it('should handle product creation with analytics tracking', async () => {
      const flowId = 'product-create-flow';

      const result = await engine.invoke('Product', 'create', {
        name: 'Test Product',
        sku: 'TEST-001',
        price: 29.99,
        description: 'A test product',
        category: 'test'
      }, flowId);

      expect(result.productId).toBeDefined();
      expect(result.product.name).toBe('Test Product');
      expect(result.product.sku).toBe('TEST-001');

      // Check analytics tracking
      const analytics = await engine.invoke('Analytics', 'getMetrics', {}, 'analytics-check');
      expect(analytics.metrics['product_created']).toBe(1);
    });
  });

  describe('Order Processing Flow', () => {
    let userId: string;
    let productId: string;

    beforeEach(async () => {
      // Create user
      const userResult = await engine.invoke('User', 'register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      }, 'setup-user');

      userId = userResult.userId;

      // Create product
      const productResult = await engine.invoke('Product', 'create', {
        name: 'Test Product',
        sku: 'TEST-001',
        price: 29.99,
        category: 'test'
      }, 'setup-product');

      productId = productResult.productId;

      // Set inventory
      await engine.invoke('Inventory', 'setStock', {
        productId,
        quantity: 10
      }, 'setup-inventory');
    });

    it('should process complete order workflow', async () => {
      const orderFlow = 'order-flow';

      // Create order
      const orderResult = await engine.invoke('Order', 'create', {
        userId,
        items: [
          {
            productId,
            quantity: 2,
            price: 29.99
          }
        ]
      }, orderFlow);

      expect(orderResult.orderId).toBeDefined();

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check order status (should be auto-confirmed)
      const orderStatus = await engine.invoke('Order', 'get', {
        orderId: orderResult.orderId
      }, 'status-check');

      expect(orderStatus.order.status).toBe('confirmed');
      expect(orderStatus.order.total).toBe(59.98); // 2 * 29.99

      // Check inventory deduction
      const inventoryStatus = await engine.invoke('Inventory', 'getStock', {
        productId
      }, 'inventory-check');

      expect(inventoryStatus.quantity).toBe(8); // 10 - 2

      // Check analytics
      const analytics = await engine.invoke('Analytics', 'getMetrics', {}, 'analytics-check');
      expect(analytics.metrics['order_created']).toBe(1);
      expect(analytics.metrics['order_confirmed']).toBe(1);
    });

    it('should handle order confirmation notifications', async () => {
      // Create and confirm order
      const orderResult = await engine.invoke('Order', 'create', {
        userId,
        items: [{ productId, quantity: 1, price: 29.99 }]
      }, 'notification-test');

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 50));

      // Check notification history
      const notifications = await engine.invoke('Notification', 'getHistory', {
        recipient: 'test@example.com'
      }, 'notification-check');

      expect(notifications.notifications.length).toBeGreaterThan(0);
      const orderNotification = notifications.notifications.find((n: any) =>
        n.template === 'order-confirmation'
      );
      expect(orderNotification).toBeDefined();
    });
  });

  describe('Plugin Integration', () => {
    it('should have all plugins loaded', () => {
      const loadedPlugins = pluginManager.getLoadedPlugins();
      expect(loadedPlugins).toHaveLength(7);
      expect(loadedPlugins).toContain('users');
      expect(loadedPlugins).toContain('products');
      expect(loadedPlugins).toContain('orders');
      expect(loadedPlugins).toContain('inventory');
      expect(loadedPlugins).toContain('payments');
      expect(loadedPlugins).toContain('notifications');
      expect(loadedPlugins).toContain('analytics');
    });

    it('should handle cross-plugin communication', async () => {
      // Create user
      const userResult = await engine.invoke('User', 'register', {
        username: 'integration-test',
        email: 'integration@example.com',
        password: 'password123'
      }, 'integration-flow');

      // Create product
      const productResult = await engine.invoke('Product', 'create', {
        name: 'Integration Product',
        sku: 'INT-001',
        price: 19.99,
        category: 'integration'
      }, 'integration-flow');

      // Set inventory
      await engine.invoke('Inventory', 'setStock', {
        productId: productResult.productId,
        quantity: 5
      }, 'integration-flow');

      // Create order (this triggers multiple plugins)
      await engine.invoke('Order', 'create', {
        userId: userResult.userId,
        items: [{
          productId: productResult.productId,
          quantity: 1,
          price: 19.99
        }]
      }, 'integration-flow');

      // Wait for all async operations
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify cross-plugin effects
      const analytics = await engine.invoke('Analytics', 'getMetrics', {}, 'final-check');
      expect(analytics.metrics['user_registered']).toBeGreaterThanOrEqual(1);
      expect(analytics.metrics['product_created']).toBeGreaterThanOrEqual(1);
      expect(analytics.metrics['order_created']).toBeGreaterThanOrEqual(1);
      expect(analytics.metrics['order_confirmed']).toBeGreaterThanOrEqual(1);
    });
  });
});
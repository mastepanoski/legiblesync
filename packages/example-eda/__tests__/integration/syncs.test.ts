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

// Mock concepts to track when their execute methods are called
const createMockConcept = (originalConcept: any, conceptName: string) => {
  const executeSpy = jest.fn(originalConcept.execute.bind(originalConcept));
  return {
    ...originalConcept,
    execute: executeSpy,
    __spy: executeSpy,
    __name: conceptName
  };
};

describe('EDA Sync Rules Integration Tests', () => {
  let engine: LegibleEngine;
  let pluginManager: PluginManager;
  let eventBus: EventBus;
  let mockConcepts: { [key: string]: any };

  beforeEach(async () => {
    engine = new LegibleEngine();
    pluginManager = new PluginManager(engine);
    eventBus = new EventBus();

    // Create mock EventBus concept
    const mockEventBus = createMockConcept({
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
    }, 'EventBus');

    // Register EventBus as a concept
    engine.registerConcept('EventBus', mockEventBus);

    // Create mock concepts for all plugins
    mockConcepts = {
      EventBus: mockEventBus
    };

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
    await engine.invoke('Order', 'reset', {}, 'reset');
    await engine.invoke('Inventory', 'reset', {}, 'reset');
    await engine.invoke('Notification', 'reset', {}, 'reset');
    await engine.invoke('Analytics', 'reset', {}, 'reset');
    await engine.invoke('Payment', 'reset', {}, 'reset');
  });

  afterEach(() => {
    // Clear all mocks
    Object.values(mockConcepts).forEach(concept => {
      if (concept.__spy) {
        concept.__spy.mockClear();
      }
    });
  });

  describe('User Event Syncs', () => {
    it('should call EventBus.publish when User.register succeeds', async () => {
      const flow = 'user-register-flow';

      // Register a user
      await engine.invoke('User', 'register', {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      }, flow);

      // Check that EventBus.publish was called with user.registered event
      expect(mockConcepts.EventBus.__spy).toHaveBeenCalledWith('publish', {
        event: 'user.registered',
        data: {
          userId: expect.any(String),
          username: 'johndoe',
          email: 'john@example.com'
        }
      });
    });
  });

  describe('Product Event Syncs', () => {
    it('should call EventBus.publish when Product.create succeeds', async () => {
      const flow = 'product-create-flow';

      // Create a product
      await engine.invoke('Product', 'create', {
        name: 'Test Product',
        sku: 'TEST-001',
        price: 29.99,
        description: 'A test product',
        category: 'test'
      }, flow);

      // Check that EventBus.publish was called with product.created event
      expect(mockConcepts.EventBus.__spy).toHaveBeenCalledWith('publish', {
        event: 'product.created',
        data: {
          productId: expect.any(String),
          name: 'Test Product',
          sku: 'TEST-001',
          price: 29.99,
          category: 'test'
        }
      });
    });
  });

  describe('Order Workflow Syncs', () => {
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

    it('should call Inventory.checkAvailability when Order.create succeeds', async () => {
      const flow = 'order-create-flow';

      // Create order
      await engine.invoke('Order', 'create', {
        userId,
        items: [
          {
            productId,
            quantity: 2,
            price: 29.99
          }
        ]
      }, flow);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 50));

      // Get the actions that were executed
      const actions = engine.getActionsByFlow(flow);

      // Check that Inventory.checkAvailability was called
      const inventoryCheckAction = actions.find(a =>
        a.concept === 'Inventory' && a.action === 'checkAvailability'
      );
      expect(inventoryCheckAction).toBeDefined();
      expect(inventoryCheckAction!.input).toEqual({
        orderId: expect.any(String),
        items: [
          {
            productId,
            quantity: 2,
            price: 29.99
          }
        ]
      });
    });

    it('should call Order.confirm when Inventory.checkAvailability returns available=true', async () => {
      const flow = 'order-confirm-flow';

      // Create order first
      await engine.invoke('Order', 'create', {
        userId,
        items: [{ productId, quantity: 1, price: 29.99 }]
      }, flow);

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 50));

      // Get the actions that were executed
      const actions = engine.getActionsByFlow(flow);

      // Check that Order.confirm was called
      const orderConfirmAction = actions.find(a =>
        a.concept === 'Order' && a.action === 'confirm'
      );
      expect(orderConfirmAction).toBeDefined();
      expect(orderConfirmAction!.input).toEqual({
        orderId: expect.any(String),
        total: 29.99
      });
    });

    it('should call User.get when Order.confirm succeeds', async () => {
      const flow = 'order-user-flow';

      // Create and confirm order
      const orderResult = await engine.invoke('Order', 'create', {
        userId,
        items: [{ productId, quantity: 1, price: 29.99 }]
      }, flow);

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get the actions that were executed
      const actions = engine.getActionsByFlow(flow);

      // Check that User.get was called
      const userGetAction = actions.find(a =>
        a.concept === 'User' && a.action === 'get'
      );
      expect(userGetAction).toBeDefined();
      expect(userGetAction!.input).toEqual({
        userId
      });
    });

    it('should call Inventory.deduct when Order.confirm succeeds', async () => {
      const flow = 'order-inventory-flow';

      // Create and confirm order
      await engine.invoke('Order', 'create', {
        userId,
        items: [{ productId, quantity: 1, price: 29.99 }]
      }, flow);

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get the actions that were executed
      const actions = engine.getActionsByFlow(flow);

      // Check that Inventory.deduct was called
      const inventoryDeductAction = actions.find(a =>
        a.concept === 'Inventory' && a.action === 'deduct'
      );
      expect(inventoryDeductAction).toBeDefined();
      expect(inventoryDeductAction!.input).toEqual({
        orderId: expect.any(String),
        items: [{ productId, quantity: 1, price: 29.99 }]
      });
    });

    it('should call Notification.send when Order.confirm and User.get succeed', async () => {
      const flow = 'order-notification-flow';

      // Create and confirm order
      await engine.invoke('Order', 'create', {
        userId,
        items: [{ productId, quantity: 1, price: 29.99 }]
      }, flow);

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get the actions that were executed
      const actions = engine.getActionsByFlow(flow);

      // Check that Notification.send was called
      const notificationAction = actions.find(a =>
        a.concept === 'Notification' && a.action === 'send'
      );
      expect(notificationAction).toBeDefined();
      expect(notificationAction!.input).toEqual({
        type: 'email',
        to: 'test@example.com',
        template: 'order-confirmation',
        data: {
          orderId: expect.any(String),
          total: 29.99,
          items: [{ productId, quantity: 1, price: 29.99 }]
        }
      });
    });
  });

  describe('Analytics Event Syncs', () => {
    it('should call Analytics.track when User.register succeeds', async () => {
      const flow = 'analytics-user-flow';

      // Register a user
      await engine.invoke('User', 'register', {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      }, flow);

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 50));

      // Get the actions that were executed
      const actions = engine.getActionsByFlow(flow);

      // Check that Analytics.track was called for user registration
      const analyticsAction = actions.find(a =>
        a.concept === 'Analytics' && a.action === 'track'
      );
      expect(analyticsAction).toBeDefined();
      expect(analyticsAction!.input).toEqual({
        event: 'user_registered',
        data: {
          userId: expect.any(String),
          username: 'johndoe',
          email: 'john@example.com'
        }
      });
    });

    it('should call Analytics.track when Product.create succeeds', async () => {
      const flow = 'analytics-product-flow';

      // Create a product
      await engine.invoke('Product', 'create', {
        name: 'Test Product',
        sku: 'TEST-001',
        price: 29.99,
        category: 'test'
      }, flow);

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 50));

      // Get the actions that were executed
      const actions = engine.getActionsByFlow(flow);

      // Check that Analytics.track was called for product creation
      const analyticsAction = actions.find(a =>
        a.concept === 'Analytics' && a.action === 'track'
      );
      expect(analyticsAction).toBeDefined();
      expect(analyticsAction!.input).toEqual({
        event: 'product_created',
        data: {
          productId: expect.any(String),
          name: 'Test Product',
          sku: 'TEST-001',
          price: 29.99,
          category: 'test'
        }
      });
    });

    it('should call Analytics.track when Order.create succeeds', async () => {
      const flow = 'analytics-order-flow';

      // Create user and product first
      const userResult = await engine.invoke('User', 'register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      }, flow);

      const productResult = await engine.invoke('Product', 'create', {
        name: 'Test Product',
        sku: 'TEST-001',
        price: 29.99,
        category: 'test'
      }, flow);

      // Set inventory
      await engine.invoke('Inventory', 'setStock', {
        productId: productResult.productId,
        quantity: 10
      }, flow);

      // Create order
      await engine.invoke('Order', 'create', {
        userId: userResult.userId,
        items: [{
          productId: productResult.productId,
          quantity: 1,
          price: 29.99
        }]
      }, flow);

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get the actions that were executed
      const actions = engine.getActionsByFlow(flow);

      // Check that Analytics.track was called for order creation
      const analyticsActions = actions.filter(a =>
        a.concept === 'Analytics' && a.action === 'track'
      );
      const orderCreatedAction = analyticsActions.find(a =>
        a.input.event === 'order_created'
      );
      expect(orderCreatedAction).toBeDefined();
      expect(orderCreatedAction!.input).toEqual({
        event: 'order_created',
        data: {
          orderId: expect.any(String),
          userId: userResult.userId,
          itemCount: 1
        }
      });
    });
  });
});
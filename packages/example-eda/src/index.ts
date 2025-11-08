// example-eda/src/index.ts
import { LegibleEngine } from '@legible-sync/core';
import { PluginManager } from './core/PluginManager';
import { EventBus } from './core/EventBus';

// Import all plugins
import { usersPlugin } from './plugins/users';
import { productsPlugin } from './plugins/products';
import { ordersPlugin } from './plugins/orders';
import { inventoryPlugin } from './plugins/inventory';
import { notificationsPlugin } from './plugins/notifications';
import { analyticsPlugin } from './plugins/analytics';
import { paymentsPlugin } from './plugins/payments';

async function main() {
  console.log('🚀 Starting Event-Driven Architecture Example\n');

// Initialize core systems
const engine = new LegibleEngine();
const pluginManager = new PluginManager(engine);
const eventBus = new EventBus();

  // Register EventBus as a concept so plugins can publish events
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
  const plugins = [
    usersPlugin,
    productsPlugin,
    inventoryPlugin,
    ordersPlugin,
    paymentsPlugin,
    notificationsPlugin,
    analyticsPlugin
  ];

  for (const plugin of plugins) {
    await pluginManager.loadPlugin(plugin);
  }

  console.log('\n✅ All plugins loaded successfully!');
  console.log('Loaded plugins:', pluginManager.getLoadedPlugins());

  // Demonstrate the EDA system with a complete e-commerce flow
  console.log('\n🛍️  Demonstrating E-commerce Flow:\n');

  try {
    // 1. Create a user
    console.log('1. 👤 Creating user...');
    const userFlow = 'user-flow-1';
    const userResult = await engine.invoke('User', 'register', {
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123'
    }, userFlow);

    console.log('   User created:', userResult.user.username);

    // 2. Create a product
    console.log('\n2. 📦 Creating product...');
    const productFlow = 'product-flow-1';
    const productResult = await engine.invoke('Product', 'create', {
      name: 'Wireless Headphones',
      sku: 'WH-001',
      price: 99.99,
      description: 'High-quality wireless headphones',
      category: 'electronics'
    }, productFlow);

    console.log('   Product created:', productResult.product.name);

    // 3. Set inventory for the product
    console.log('\n3. 📊 Setting inventory...');
    await engine.invoke('Inventory', 'setStock', {
      productId: productResult.productId,
      quantity: 10
    }, 'inventory-flow-1');

    console.log('   Inventory set: 10 units');

    // 4. Create an order
    console.log('\n4. 🛒 Creating order...');
    const orderFlow = 'order-flow-1';
    const orderResult = await engine.invoke('Order', 'create', {
      userId: userResult.userId,
      items: [
        {
          productId: productResult.productId,
          quantity: 2,
          price: productResult.product.price
        }
      ]
    }, orderFlow);

    console.log('   Order created, checking inventory...');

    // The system should automatically:
    // - Check inventory availability
    // - Confirm the order if available
    // - Initiate and process payment
    // - Deduct inventory
    // - Send confirmation notification
    // - Track analytics events

    // Wait a bit for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    // 5. Check order status
    console.log('\n5. 📋 Checking order status...');
    const orderStatus = await engine.invoke('Order', 'get', {
      orderId: orderResult.orderId
    }, 'status-flow-1');

    console.log('   Order status:', orderStatus.order.status);
    console.log('   Order total: $' + orderStatus.order.total);

    // 6. Check payment status
    console.log('\n6. 💳 Checking payment status...');
    const paymentStatus = await engine.invoke('Payment', 'getByOrderId', {
      orderId: orderResult.orderId
    }, 'payment-check-flow-1');

    console.log('   Payment status:', paymentStatus.payment.status);
    console.log('   Payment amount: $' + paymentStatus.payment.amount);

    // 7. Check inventory after order
    console.log('\n7. 📊 Checking inventory after order...');
    const inventoryStatus = await engine.invoke('Inventory', 'getStock', {
      productId: productResult.productId
    }, 'inventory-check-flow-1');

    console.log('   Remaining stock:', inventoryStatus.quantity, 'units');

    // 8. Check analytics
    console.log('\n8. 📈 Checking analytics...');
    const analytics = await engine.invoke('Analytics', 'getMetrics', {}, 'analytics-flow-1');
    console.log('   Events tracked:', analytics.metrics);

    console.log('\n🎉 E-commerce flow completed successfully!');
    console.log('The system automatically handled:');
    console.log('  ✓ Inventory validation');
    console.log('  ✓ Order confirmation');
    console.log('  ✓ Payment processing');
    console.log('  ✓ Stock deduction');
    console.log('  ✓ Email notifications');
    console.log('  ✓ Analytics tracking');

  } catch (error) {
    console.error('❌ Error in demo:', error);
  }
}

// Run the demo
main().catch(console.error);
// plugins/orders/index.ts
import { Plugin } from '../../core/PluginManager';
import { Order } from './concepts/Order';
import { orderWorkflowSyncs } from './syncs/order-workflow.sync';

export const ordersPlugin: Plugin = {
  name: 'orders',
  concepts: {
    Order
  },
  syncs: orderWorkflowSyncs,
  initialize: async (_engine) => {
    console.log('🛒 Orders plugin initialized');
  }
};
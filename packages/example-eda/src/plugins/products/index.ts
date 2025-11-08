// plugins/products/index.ts
import { Plugin } from '../../core/PluginManager';
import { Product } from './concepts/Product';
import { productEventSyncs } from './syncs/product-events.sync';

export const productsPlugin: Plugin = {
  name: 'products',
  concepts: {
    Product
  },
  syncs: productEventSyncs,
  initialize: async (engine) => {
    console.log('📦 Products plugin initialized');
  }
};
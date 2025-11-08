// plugins/inventory/index.ts
import { Plugin } from '../../core/PluginManager';
import { Inventory } from './concepts/Inventory';

export const inventoryPlugin: Plugin = {
  name: 'inventory',
  concepts: {
    Inventory
  },
  syncs: [],
  initialize: async (engine) => {
    console.log('📊 Inventory plugin initialized');
  }
};
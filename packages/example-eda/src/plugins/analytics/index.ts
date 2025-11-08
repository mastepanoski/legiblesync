// plugins/analytics/index.ts
import { Plugin } from '../../core/PluginManager';
import { Analytics } from './concepts/Analytics';
import { analyticsEventSyncs } from './syncs/analytics-events.sync';

export const analyticsPlugin: Plugin = {
  name: 'analytics',
  concepts: {
    Analytics
  },
  syncs: analyticsEventSyncs,
  initialize: async (_engine) => {
    console.log('📈 Analytics plugin initialized');
  }
};
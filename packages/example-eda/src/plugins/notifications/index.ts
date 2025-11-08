// plugins/notifications/index.ts
import { Plugin } from '../../core/PluginManager';
import { Notification } from './concepts/Notification';

export const notificationsPlugin: Plugin = {
  name: 'notifications',
  concepts: {
    Notification
  },
  syncs: [],
  initialize: async (_engine) => {
    console.log('🔔 Notifications plugin initialized');
  }
};
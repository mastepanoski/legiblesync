// plugins/users/index.ts
import { Plugin } from '../../core/PluginManager';
import { User } from './concepts/User';
import { userEventSyncs } from './syncs/user-events.sync';

export const usersPlugin: Plugin = {
  name: 'users',
  concepts: {
    User
  },
  syncs: userEventSyncs,
  initialize: async (engine) => {
    console.log('👤 Users plugin initialized');
  }
};
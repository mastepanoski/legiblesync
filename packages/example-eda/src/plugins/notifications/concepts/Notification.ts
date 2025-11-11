// plugins/notifications/concepts/Notification.ts
import { Concept } from '@legible-sync/core';

export const Notification: Concept = {
  state: {
    sent: new Map<string, any[]>(),
  },

  async execute(action: string, input: any) {
    const state = this.state;

    switch (action) {
      case 'send': {
        const { type, to, template, data } = input;

        // Simulate sending notification
        const notificationId = `notif_${Date.now()}`;
        const notification = {
          id: notificationId,
          type,
          to,
          template,
          data,
          sentAt: new Date(),
          status: 'sent'
        };

        // Store sent notifications
        if (!state.sent.has(to)) {
          state.sent.set(to, []);
        }
        state.sent.get(to)!.push(notification);

        console.log(`📧 ${type.toUpperCase()} sent to ${to}: ${template}`);

        return { notificationId, notification };
      }

      case 'getHistory': {
        const { recipient } = input;
        const history = state.sent.get(recipient) || [];
        return { notifications: history };
      }

      case 'reset': {
        state.sent.clear();
        return { reset: true };
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
};
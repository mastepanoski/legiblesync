// plugins/analytics/concepts/Analytics.ts
import { Concept } from '@legible-sync/core';

export const Analytics: Concept = {
  state: {
    events: new Map<string, any[]>(),
    metrics: new Map<string, number>(),
  },

  async execute(action: string, input: any) {
    const state = this.state;

    switch (action) {
      case 'track': {
        const { event, data } = input;

        if (!state.events.has(event)) {
          state.events.set(event, []);
        }

        const eventData = {
          ...data,
          timestamp: new Date(),
          id: `event_${Date.now()}`
        };

        state.events.get(event)!.push(eventData);

        // Update metrics
        const count = state.metrics.get(event) || 0;
        state.metrics.set(event, count + 1);

        console.log(`📊 Tracked: ${event}`, data);

        return { eventId: eventData.id };
      }

      case 'getMetrics': {
        const metrics = Object.fromEntries(state.metrics);
        return { metrics };
      }

      case 'getEvents': {
        const { event, limit = 10 } = input;
        const events = state.events.get(event) || [];
        return { events: events.slice(-limit) };
      }

      case 'reset': {
        state.events.clear();
        state.metrics.clear();
        return { success: true };
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
};
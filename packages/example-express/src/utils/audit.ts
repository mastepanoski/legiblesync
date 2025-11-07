// utils/audit.ts
import { LegibleEngine, ActionRecord } from '@legible-sync/core';

export function auditFlow(engine: LegibleEngine, flow: string): void {
  const actions = engine.getActionsByFlow(flow);

  console.log(`\n=== AUDIT LOG FOR FLOW: ${flow} ===`);
  console.log(`Total actions: ${actions.length}\n`);

  actions.forEach((action, index) => {
    console.log(`${index + 1}. [${action.concept}] ${action.action}`);
    console.log(`   Input: ${JSON.stringify(action.input, null, 2)}`);
    if (action.output) {
      console.log(`   Output: ${JSON.stringify(action.output, null, 2)}`);
    }
    console.log(`   Sync Edges: ${Object.keys(action.syncEdges || {}).length} triggered\n`);
  });

  // Summary statistics
  const conceptStats = actions.reduce((acc, action) => {
    acc[action.concept] = (acc[action.concept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('=== SUMMARY ===');
  Object.entries(conceptStats).forEach(([concept, count]) => {
    console.log(`${concept}: ${count} actions`);
  });
  console.log('================\n');
}

export function getFlowSummary(engine: LegibleEngine, flow: string): {
  totalActions: number;
  conceptsUsed: string[];
  successRate: number;
  duration?: number;
} {
  const actions = engine.getActionsByFlow(flow);

  const conceptsUsed = [...new Set(actions.map(a => a.concept))];
  const failedActions = actions.filter(a => a.output?.error).length;
  const successRate = actions.length > 0 ? ((actions.length - failedActions) / actions.length) * 100 : 0;

  return {
    totalActions: actions.length,
    conceptsUsed,
    successRate: Math.round(successRate * 100) / 100
  };
}
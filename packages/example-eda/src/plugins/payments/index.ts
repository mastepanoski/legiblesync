// plugins/payments/index.ts
import { Plugin } from '../../core/PluginManager';
import { Payment } from './concepts/Payment';
import { paymentWorkflowSyncs } from './syncs/payment-workflow.sync';

export const paymentsPlugin: Plugin = {
  name: 'payments',
  concepts: {
    Payment
  },
  syncs: paymentWorkflowSyncs,
  initialize: async (_engine) => {
    console.log('💳 Payments plugin initialized');
  }
};
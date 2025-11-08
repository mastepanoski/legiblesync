// plugins/payments/concepts/Payment.ts
import { Concept } from '@legible-sync/core';
import { v4 as uuidv4 } from 'uuid';

export const Payment: Concept = {
  state: {
    payments: new Map<string, any>(),
    transactions: new Map<string, any>(),
  },

  async execute(action: string, input: any) {
    const state = this.state;

    switch (action) {
      case 'initiate': {
        const { orderId, amount, method } = input;

        // Validation
        if (!orderId || !amount || amount <= 0) {
          throw new Error('Order ID and positive amount are required');
        }

        // Create payment
        const paymentId = uuidv4();
        const payment = {
          id: paymentId,
          orderId,
          amount,
          method: method || 'credit_card',
          status: 'pending',
          createdAt: new Date(),
          transactions: []
        };

        state.payments.set(paymentId, payment);

        return { paymentId, payment };
      }

      case 'process': {
        const { paymentId } = input;
        const payment = state.payments.get(paymentId);
        if (!payment) {
          throw new Error('Payment not found');
        }

        if (payment.status !== 'pending') {
          throw new Error('Payment is not in pending status');
        }

        // Simulate payment processing (in real app, integrate with payment gateway)
        const transactionId = uuidv4();
        const transaction = {
          id: transactionId,
          paymentId,
          type: 'charge',
          amount: payment.amount,
          status: 'processing',
          gatewayResponse: 'Processing payment...',
          createdAt: new Date()
        };

        state.transactions.set(transactionId, transaction);
        payment.transactions.push(transactionId);
        payment.status = 'processing';
        state.payments.set(paymentId, payment);

        return { payment, transaction };
      }

      case 'confirm': {
        const { paymentId, transactionId } = input;
        const payment = state.payments.get(paymentId);
        const transaction = state.transactions.get(transactionId);

        if (!payment || !transaction) {
          throw new Error('Payment or transaction not found');
        }

        if (payment.status !== 'processing') {
          throw new Error('Payment is not in processing status');
        }

        // Confirm payment
        payment.status = 'completed';
        payment.completedAt = new Date();
        transaction.status = 'completed';
        transaction.gatewayResponse = 'Payment successful';
        transaction.completedAt = new Date();

        state.payments.set(paymentId, payment);
        state.transactions.set(transactionId, transaction);

        return { payment, transaction };
      }

      case 'fail': {
        const { paymentId, reason } = input;
        const payment = state.payments.get(paymentId);
        if (!payment) {
          throw new Error('Payment not found');
        }

        payment.status = 'failed';
        payment.failedAt = new Date();
        payment.failureReason = reason;
        state.payments.set(paymentId, payment);

        // Mark any pending transactions as failed
        for (const txId of payment.transactions) {
          const tx = state.transactions.get(txId);
          if (tx && tx.status === 'processing') {
            tx.status = 'failed';
            tx.gatewayResponse = reason;
            state.transactions.set(txId, tx);
          }
        }

        return { payment };
      }

      case 'refund': {
        const { paymentId, amount, reason } = input;
        const payment = state.payments.get(paymentId);
        if (!payment) {
          throw new Error('Payment not found');
        }

        if (payment.status !== 'completed') {
          throw new Error('Can only refund completed payments');
        }

        const refundAmount = amount || payment.amount;
        if (refundAmount > payment.amount) {
          throw new Error('Refund amount cannot exceed payment amount');
        }

        // Create refund transaction
        const transactionId = uuidv4();
        const transaction = {
          id: transactionId,
          paymentId,
          type: 'refund',
          amount: refundAmount,
          status: 'completed',
          gatewayResponse: 'Refund processed',
          reason,
          createdAt: new Date(),
          completedAt: new Date()
        };

        state.transactions.set(transactionId, transaction);
        payment.transactions.push(transactionId);
        payment.status = refundAmount === payment.amount ? 'refunded' : 'partially_refunded';
        state.payments.set(paymentId, payment);

        return { payment, transaction };
      }

      case 'get': {
        const { paymentId } = input;
        const payment = state.payments.get(paymentId);
        if (!payment) {
          throw new Error('Payment not found');
        }

        const transactions = payment.transactions.map((txId: string) => state.transactions.get(txId));
        return { payment: { ...payment, transactions } };
      }

      case 'getByOrderId': {
        const { orderId } = input;
        for (const [paymentId, payment] of state.payments) {
          if (payment.orderId === orderId) {
            const transactions = payment.transactions.map((txId: string) => state.transactions.get(txId));
            return { payment: { ...payment, transactions }, paymentId };
          }
        }
        throw new Error('Payment not found for order');
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
};
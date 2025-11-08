// plugins/payments/syncs/payment-workflow.sync.ts
import { SyncRule } from '@legible-sync/core';

export const paymentWorkflowSyncs: SyncRule[] = [
  // When order is confirmed, initiate payment
  {
    name: "InitiatePaymentOnOrderConfirm",
    when: [
      {
        concept: "Order",
        action: "confirm"
      }
    ],
    then: [
      {
        concept: "Payment",
        action: "initiate",
        input: {
          orderId: "?orderId",
          amount: "?order.total",
          method: "credit_card"
        }
      }
    ]
  },

  // When payment is initiated, automatically process it
  {
    name: "AutoProcessPayment",
    when: [
      {
        concept: "Payment",
        action: "initiate"
      }
    ],
    then: [
      {
        concept: "Payment",
        action: "process",
        input: {
          paymentId: "?paymentId"
        }
      }
    ]
  },

  // When payment processing starts, confirm it (simplified for demo)
  {
    name: "AutoConfirmPayment",
    when: [
      {
        concept: "Payment",
        action: "process"
      }
    ],
    then: [
      {
        concept: "Payment",
        action: "confirm",
        input: {
          paymentId: "?paymentId",
          transactionId: "?transaction.id"
        }
      }
    ]
  },

  // When payment is confirmed, get order details first
  {
    name: "GetOrderDetailsAfterPaymentConfirm",
    when: [
      {
        concept: "Payment",
        action: "confirm"
      }
    ],
    then: [
      {
        concept: "Order",
        action: "get",
        input: {
          orderId: "?payment.orderId"
        }
      }
    ]
  },

  // When order details are retrieved after payment confirmation, get user details
  {
    name: "GetUserDetailsAfterPaymentConfirm",
    when: [
      {
        concept: "Order",
        action: "get"
      }
    ],
    then: [
      {
        concept: "User",
        action: "get",
        input: {
          userId: "?order.userId"
        }
      }
    ]
  },

  // When user details are retrieved after payment confirmation, send notification
  {
    name: "SendPaymentSuccessNotification",
    when: [
      {
        concept: "User",
        action: "get"
      }
    ],
    then: [
      {
        concept: "Notification",
        action: "send",
        input: {
          type: "email",
          to: "?user.email",
          template: "payment-success",
          data: {
            orderId: "?payment.orderId",
            amount: "?payment.amount",
            paymentId: "?paymentId"
          }
        }
      }
    ]
  },

  // When payment fails, get order details first
  {
    name: "GetOrderDetailsAfterPaymentFail",
    when: [
      {
        concept: "Payment",
        action: "fail"
      }
    ],
    then: [
      {
        concept: "Order",
        action: "get",
        input: {
          orderId: "?payment.orderId"
        }
      },
      {
        concept: "Order",
        action: "cancel",
        input: {
          orderId: "?payment.orderId"
        }
      }
    ]
  },

  // When order details are retrieved after payment failure, get user details
  {
    name: "GetUserDetailsAfterPaymentFail",
    when: [
      {
        concept: "Order",
        action: "get"
      }
    ],
    then: [
      {
        concept: "User",
        action: "get",
        input: {
          userId: "?order.userId"
        }
      }
    ]
  },

  // When user details are retrieved after payment failure, send notification
  {
    name: "SendPaymentFailureNotification",
    when: [
      {
        concept: "User",
        action: "get"
      }
    ],
    then: [
      {
        concept: "Notification",
        action: "send",
        input: {
          type: "email",
          to: "?user.email",
          template: "payment-failed",
          data: {
            orderId: "?payment.orderId",
            reason: "?payment.failureReason"
          }
        }
      }
    ]
  },

  // When refund is processed, get order details first
  {
    name: "GetOrderDetailsAfterRefund",
    when: [
      {
        concept: "Payment",
        action: "refund"
      }
    ],
    then: [
      {
        concept: "Order",
        action: "get",
        input: {
          orderId: "?payment.orderId"
        }
      }
    ]
  },

  // When order details are retrieved after refund, get user details
  {
    name: "GetUserDetailsAfterRefund",
    when: [
      {
        concept: "Order",
        action: "get"
      }
    ],
    then: [
      {
        concept: "User",
        action: "get",
        input: {
          userId: "?order.userId"
        }
      }
    ]
  },

  // When user details are retrieved after refund, send notification
  {
    name: "SendRefundNotification",
    when: [
      {
        concept: "User",
        action: "get"
      }
    ],
    then: [
      {
        concept: "Notification",
        action: "send",
        input: {
          type: "email",
          to: "?user.email",
          template: "payment-refund",
          data: {
            orderId: "?payment.orderId",
            amount: "?transaction.amount",
            reason: "?transaction.reason"
          }
        }
      }
    ]
  }
];
# LegibleSync Sync Rules Documentation

This document provides comprehensive documentation of all synchronization rules across the LegibleSync monorepo.

## Table of Contents

- [Example Console](#example-console)
  - [Article Syncs](#console-article-syncs)
  - [Comment Syncs](#console-comment-syncs)
  - [Favorite Syncs](#console-favorite-syncs)
  - [Persistence Syncs](#console-persistence-syncs)
  - [Registration Syncs](#console-registration-syncs)
- [Example Express](#example-express)
  - [Article Syncs](#express-article-syncs)
  - [Comment Syncs](#express-comment-syncs)
  - [Favorite Syncs](#express-favorite-syncs)
  - [Registration Syncs](#express-registration-syncs)
- [Example Next.js SSE](#example-nextjs-sse)
  - [Comment Syncs](#nextjs-comment-syncs)
  - [Logging Syncs](#nextjs-logging-syncs)
- [Example EDA](#example-eda)
  - [Analytics Events](#eda-analytics-events)
  - [Order Workflow](#eda-order-workflow)
  - [Payment Workflow](#eda-payment-workflow)
  - [Product Events](#eda-product-events)
  - [User Events](#eda-user-events)

---

## Example Console

Package: `@legible-sync/example-console`

<a name="console-article-syncs"></a>
## Article Syncs

Source: [`packages/example-console/src/syncs/article.sync.ts`](file:///Users/mastepanoski/projects/web/ai/legible-sync/packages/example-console/src/syncs/article.sync.ts)

### VerifyTokenForArticles

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/articles"
  }
  ```

**Then:**
- `JWT/verify` with input:
  ```json
  {
    "token": "?token"
  }
  ```

---

### CreateArticle

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/articles"
  }
  ```
- `JWT/verify` outputs:
  ```json
  {
    "user": "?user"
  }
  ```

**Then:**
- `Article/create` with input:
  ```json
  {
    "article": "uuid()",
    "title": "?body.title",
    "body": "?body.body",
    "author": "?user"
  }
  ```

---

<a name="console-comment-syncs"></a>
## Comment Syncs

Source: [`packages/example-console/src/syncs/comment.sync.ts`](file:///Users/mastepanoski/projects/web/ai/legible-sync/packages/example-console/src/syncs/comment.sync.ts)

### VerifyTokenForComments

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/articles/*/comments"
  }
  ```

**Then:**
- `JWT/verify` with input:
  ```json
  {
    "token": "?token"
  }
  ```

---

### CreateComment

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/articles/*/comments"
  }
  ```
- `JWT/verify` outputs:
  ```json
  {
    "user": "?user"
  }
  ```

**Then:**
- `Comment/create` with input:
  ```json
  {
    "comment": "uuid()",
    "articleId": "?path[1]",
    "authorId": "?user",
    "content": "?body.body"
  }
  ```

---

<a name="console-favorite-syncs"></a>
## Favorite Syncs

Source: [`packages/example-console/src/syncs/favorite.sync.ts`](file:///Users/mastepanoski/projects/web/ai/legible-sync/packages/example-console/src/syncs/favorite.sync.ts)

### VerifyTokenForAddFavorite

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/articles/*/favorite"
  }
  ```

**Then:**
- `JWT/verify` with input:
  ```json
  {
    "token": "?token"
  }
  ```

---

### AddFavorite

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/articles/*/favorite"
  }
  ```
- `JWT/verify` outputs:
  ```json
  {
    "user": "?user"
  }
  ```

**Then:**
- `Favorite/add` with input:
  ```json
  {
    "article": "?path[1]",
    "user": "?user"
  }
  ```

---

### VerifyTokenForRemoveFavorite

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "DELETE",
    "path": "/articles/*/favorite"
  }
  ```

**Then:**
- `JWT/verify` with input:
  ```json
  {
    "token": "?token"
  }
  ```

---

### RemoveFavorite

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "DELETE",
    "path": "/articles/*/favorite"
  }
  ```
- `JWT/verify` outputs:
  ```json
  {
    "user": "?user"
  }
  ```

**Then:**
- `Favorite/remove` with input:
  ```json
  {
    "article": "?path[1]",
    "user": "?user"
  }
  ```

---

<a name="console-persistence-syncs"></a>
## Persistence Syncs

Source: [`packages/example-console/src/syncs/persistence.sync.ts`](file:///Users/mastepanoski/projects/web/ai/legible-sync/packages/example-console/src/syncs/persistence.sync.ts)

### PersistUserRegistration

**When:**
- `User/register`

**Then:**
- `Persistence/store` with input:
  ```json
  {
    "subject": "user_?user",
    "predicate": "registered",
    "object": "true"
  }
  ```
- `Persistence/store` with input:
  ```json
  {
    "subject": "user_?user",
    "predicate": "username",
    "object": "?username"
  }
  ```
- `Persistence/store` with input:
  ```json
  {
    "subject": "user_?user",
    "predicate": "email",
    "object": "?email"
  }
  ```

---

### PersistArticleCreation

**When:**
- `Article/create`

**Then:**
- `Persistence/store` with input:
  ```json
  {
    "subject": "article_?article",
    "predicate": "created",
    "object": "true"
  }
  ```
- `Persistence/store` with input:
  ```json
  {
    "subject": "article_?article",
    "predicate": "title",
    "object": "?title"
  }
  ```
- `Persistence/store` with input:
  ```json
  {
    "subject": "article_?article",
    "predicate": "author",
    "object": "?author"
  }
  ```
- `Persistence/store` with input:
  ```json
  {
    "subject": "article_?article",
    "predicate": "slug",
    "object": "?slug"
  }
  ```

---

### PersistPasswordSet

**When:**
- `Password/set`

**Then:**
- `Persistence/store` with input:
  ```json
  {
    "subject": "user_?user",
    "predicate": "hasPassword",
    "object": "true"
  }
  ```

---

<a name="console-registration-syncs"></a>
## Registration Syncs

Source: [`packages/example-console/src/syncs/registration.sync.ts`](file:///Users/mastepanoski/projects/web/ai/legible-sync/packages/example-console/src/syncs/registration.sync.ts)

### HandleRegistration

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/users"
  }
  ```

**Then:**
- `Password/validate` with input:
  ```json
  {
    "password": "?body.password"
  }
  ```

---

### RegisterUserAfterValidation

**When:**
- `Password/validate` outputs:
  ```json
  {
    "valid": true
  }
  ```

**Then:**
- `User/register` with input:
  ```json
  {
    "user": "uuid()",
    "username": "?body.username",
    "email": "?body.email"
  }
  ```

---

### CompleteRegistrationAfterUser

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/users"
  }
  ```
- `User/register`

**Then:**
- `Password/set` with input:
  ```json
  {
    "user": "?user",
    "password": "?body.password"
  }
  ```
- `JWT/generate` with input:
  ```json
  {
    "user": "?user"
  }
  ```

---

### FilteredUserNotification

**When:**
- `User/register`

**Then:**
- `Web/respond` with input:
  ```json
  {
    "request": "?request",
    "code": 200,
    "body": {
      "message": "Welcome premium user: ?username"
    }
  }
  ```

---

### HandleLogin

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/login"
  }
  ```

**Then:**
- `Password/verify` with input:
  ```json
  {
    "user": "?body.username",
    "password": "?body.password"
  }
  ```

---

### GenerateTokenAfterLogin

**When:**
- `Password/verify`

**Then:**
- `JWT/generate` with input:
  ```json
  {
    "user": "?user"
  }
  ```

---

## Example Express

Package: `@legible-sync/example-express`

<a name="express-article-syncs"></a>
## Article Syncs

Source: [`packages/example-express/src/syncs/article.sync.ts`](file:///Users/mastepanoski/projects/web/ai/legible-sync/packages/example-express/src/syncs/article.sync.ts)

### VerifyTokenForArticles

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/articles",
    "token": "?token"
  }
  ```
  outputs:
  ```json
  {
    "request": "?req"
  }
  ```

**Then:**
- `JWT/verify` with input:
  ```json
  {
    "token": "?token"
  }
  ```

---

### CreateArticle

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/articles",
    "token": "?token"
  }
  ```
  outputs:
  ```json
  {
    "request": "?req"
  }
  ```
- `JWT/verify` outputs:
  ```json
  {
    "user": "?user"
  }
  ```

**Then:**
- `Article/create` with input:
  ```json
  {
    "article": "uuid()",
    "title": "?body.title",
    "body": "?body.body",
    "author": "?user"
  }
  ```

---

<a name="express-comment-syncs"></a>
## Comment Syncs

Source: [`packages/example-express/src/syncs/comment.sync.ts`](file:///Users/mastepanoski/projects/web/ai/legible-sync/packages/example-express/src/syncs/comment.sync.ts)

### VerifyTokenForComments

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/articles/*/comments",
    "token": "?token"
  }
  ```
  outputs:
  ```json
  {
    "request": "?req"
  }
  ```

**Then:**
- `JWT/verify` with input:
  ```json
  {
    "token": "?token"
  }
  ```

---

### CreateComment

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/articles/*/comments",
    "token": "?token"
  }
  ```
  outputs:
  ```json
  {
    "request": "?req"
  }
  ```
- `JWT/verify` outputs:
  ```json
  {
    "user": "?user"
  }
  ```

**Then:**
- `Comment/create` with input:
  ```json
  {
    "comment": "uuid()",
    "article": "?path[2]",
    "author": "?user",
    "body": "?body.body"
  }
  ```

---

<a name="express-favorite-syncs"></a>
## Favorite Syncs

Source: [`packages/example-express/src/syncs/favorite.sync.ts`](file:///Users/mastepanoski/projects/web/ai/legible-sync/packages/example-express/src/syncs/favorite.sync.ts)

### VerifyTokenForAddFavorite

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/articles/*/favorite",
    "token": "?token"
  }
  ```
  outputs:
  ```json
  {
    "request": "?req"
  }
  ```

**Then:**
- `JWT/verify` with input:
  ```json
  {
    "token": "?token"
  }
  ```

---

### AddFavorite

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/articles/*/favorite",
    "token": "?token"
  }
  ```
  outputs:
  ```json
  {
    "request": "?req"
  }
  ```
- `JWT/verify` outputs:
  ```json
  {
    "user": "?user"
  }
  ```

**Then:**
- `Favorite/add` with input:
  ```json
  {
    "article": "?path[2]",
    "user": "?user"
  }
  ```

---

### VerifyTokenForRemoveFavorite

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "DELETE",
    "path": "/articles/*/favorite",
    "token": "?token"
  }
  ```
  outputs:
  ```json
  {
    "request": "?req"
  }
  ```

**Then:**
- `JWT/verify` with input:
  ```json
  {
    "token": "?token"
  }
  ```

---

### RemoveFavorite

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "DELETE",
    "path": "/articles/*/favorite",
    "token": "?token"
  }
  ```
  outputs:
  ```json
  {
    "request": "?req"
  }
  ```
- `JWT/verify` outputs:
  ```json
  {
    "user": "?user"
  }
  ```

**Then:**
- `Favorite/remove` with input:
  ```json
  {
    "article": "?path[2]",
    "user": "?user"
  }
  ```

---

<a name="express-registration-syncs"></a>
## Registration Syncs

Source: [`packages/example-express/src/syncs/registration.sync.ts`](file:///Users/mastepanoski/projects/web/ai/legible-sync/packages/example-express/src/syncs/registration.sync.ts)

### ValidatePasswordFirst

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/users"
  }
  ```
  outputs:
  ```json
  {
    "request": "?req"
  }
  ```

**Then:**
- `Password/validate` with input:
  ```json
  {
    "password": "?body.password"
  }
  ```

---

### RegisterOnValidPassword

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/users"
  }
  ```
  outputs:
  ```json
  {
    "request": "?req"
  }
  ```
- `Password/validate` outputs: `{}`

**Then:**
- `User/register` with input:
  ```json
  {
    "user": "uuid()",
    "username": "?body.username",
    "email": "?body.email"
  }
  ```
- `Password/set` with input:
  ```json
  {
    "user": "?user",
    "password": "?body.password"
  }
  ```
- `JWT/generate` with input:
  ```json
  {
    "user": "?user"
  }
  ```

---

### LoginUser

**When:**
- `Web/request` with input:
  ```json
  {
    "method": "POST",
    "path": "/login"
  }
  ```
  outputs:
  ```json
  {
    "request": "?req"
  }
  ```

**Then:**
- `User/getByUsername` with input:
  ```json
  {
    "username": "?body.username"
  }
  ```
- `Password/verify` with input:
  ```json
  {
    "user": "?user",
    "password": "?body.password"
  }
  ```
- `JWT/generate` with input:
  ```json
  {
    "user": "?user"
  }
  ```

---

## Example Next.js SSE

Package: `@legible-sync/example-nextjs-sse`

<a name="nextjs-comment-syncs"></a>
## Comment Syncs

Source: [`packages/example-nextjs-sse/src/syncs/comment.sync.ts`](file:///Users/mastepanoski/projects/web/ai/legible-sync/packages/example-nextjs-sse/src/syncs/comment.sync.ts)

### CreateCommentAndNotify

**When:**
- `Comment/create` outputs:
  ```json
  {
    "commentId": "?commentId",
    "timestamp": "?timestamp",
    "nombre": "?nombre",
    "comentario": "?comentario"
  }
  ```

**Then:**
- `Logger/logCommentCreation` with input:
  ```json
  {
    "timestamp": "?timestamp",
    "nombre": "?nombre",
    "comentario": "?comentario"
  }
  ```
- `CSVWriter/appendComment` with input:
  ```json
  {
    "timestamp": "?timestamp",
    "nombre": "?nombre",
    "comentario": "?comentario"
  }
  ```
- `SSEEmitter/emitNewComment` with input:
  ```json
  {
    "timestamp": "?timestamp",
    "nombre": "?nombre",
    "comentario": "?comentario"
  }
  ```

---

<a name="nextjs-logging-syncs"></a>
## Logging Syncs

Source: [`packages/example-nextjs-sse/src/syncs/logging.sync.ts`](file:///Users/mastepanoski/projects/web/ai/legible-sync/packages/example-nextjs-sse/src/syncs/logging.sync.ts)

### LogCommentCreation

**When:**
- `Comment/create` outputs:
  ```json
  {
    "timestamp": "?timestamp",
    "nombre": "?nombre",
    "comentario": "?comentario"
  }
  ```

**Then:**
- `Logger/logCommentCreation` with input:
  ```json
  {
    "timestamp": "?timestamp",
    "nombre": "?nombre",
    "comentario": "?comentario"
  }
  ```

---

## Example EDA

Package: `@legible-sync/example-eda`

<a name="eda-analytics-events"></a>
## Analytics Events

Source: [`packages/example-eda/src/plugins/analytics/syncs/analytics-events.sync.ts`](file:///Users/mastepanoski/projects/web/ai/legible-sync/packages/example-eda/src/plugins/analytics/syncs/analytics-events.sync.ts)

### TrackUserRegistration

**When:**
- `User/register`

**Then:**
- `Analytics/track` with input:
  ```json
  {
    "event": "user_registered",
    "data": {
      "userId": "?userId",
      "username": "?username",
      "email": "?email"
    }
  }
  ```

---

### TrackProductCreation

**When:**
- `Product/create`

**Then:**
- `Analytics/track` with input:
  ```json
  {
    "event": "product_created",
    "data": {
      "productId": "?productId",
      "name": "?name",
      "category": "?category",
      "price": "?price",
      "sku": "?sku"
    }
  }
  ```

---

### TrackOrderCreation

**When:**
- `Order/create`

**Then:**
- `Analytics/track` with input:
  ```json
  {
    "event": "order_created",
    "data": {
      "orderId": "?orderId",
      "userId": "?userId",
      "itemCount": "?items.length"
    }
  }
  ```

---

### TrackOrderConfirmation

**When:**
- `Order/confirm`

**Then:**
- `Analytics/track` with input:
  ```json
  {
    "event": "order_confirmed",
    "data": {
      "orderId": "?orderId",
      "total": "?total"
    }
  }
  ```

---

<a name="eda-order-workflow"></a>
## Order Workflow

Source: [`packages/example-eda/src/plugins/orders/syncs/order-workflow.sync.ts`](file:///Users/mastepanoski/projects/web/ai/legible-sync/packages/example-eda/src/plugins/orders/syncs/order-workflow.sync.ts)

### CheckInventoryAfterOrderCreation

**When:**
- `Order/create`

**Then:**
- `Inventory/checkAvailability` with input:
  ```json
  {
    "orderId": "?orderId",
    "items": "?order.items"
  }
  ```

---

### ConfirmOrderIfInventoryAvailable

**When:**
- `Inventory/checkAvailability`

**Then:**
- `Order/confirm` with input:
  ```json
  {
    "orderId": "?orderId",
    "total": "?total"
  }
  ```

---

### GetUserDetailsAfterOrderConfirm

**When:**
- `Order/confirm`

**Then:**
- `User/get` with input:
  ```json
  {
    "userId": "?order.userId"
  }
  ```

---

### CancelOrderIfInventoryUnavailable

**When:**
- `Inventory/checkAvailability`

**Then:**
- `Order/cancel` with input:
  ```json
  {
    "orderId": "?orderId"
  }
  ```

---

### DeductInventoryOnOrderConfirm

**When:**
- `Order/confirm`

**Then:**
- `Inventory/deduct` with input:
  ```json
  {
    "orderId": "?orderId",
    "items": "?order.items"
  }
  ```

---

### SendOrderConfirmationNotification

**When:**
- `Order/confirm`
- `User/get`

**Then:**
- `Notification/send` with input:
  ```json
  {
    "type": "email",
    "to": "?user.email",
    "template": "order-confirmation",
    "data": {
      "orderId": "?order.id",
      "total": "?order.total",
      "items": "?order.items"
    }
  }
  ```

---

### SendShippingNotification

**When:**
- `Order/ship`

**Then:**
- `Notification/send` with input:
  ```json
  {
    "type": "email",
    "to": "?user.email",
    "template": "order-shipped",
    "data": {
      "orderId": "?orderId",
      "trackingNumber": "?order.trackingNumber"
    }
  }
  ```

---

<a name="eda-payment-workflow"></a>
## Payment Workflow

Source: [`packages/example-eda/src/plugins/payments/syncs/payment-workflow.sync.ts`](file:///Users/mastepanoski/projects/web/ai/legible-sync/packages/example-eda/src/plugins/payments/syncs/payment-workflow.sync.ts)

### InitiatePaymentOnOrderConfirm

**When:**
- `Order/confirm`

**Then:**
- `Payment/initiate` with input:
  ```json
  {
    "orderId": "?orderId",
    "amount": "?order.total",
    "method": "credit_card"
  }
  ```

---

### AutoProcessPayment

**When:**
- `Payment/initiate`

**Then:**
- `Payment/process` with input:
  ```json
  {
    "paymentId": "?paymentId"
  }
  ```

---

### AutoConfirmPayment

**When:**
- `Payment/process`

**Then:**
- `Payment/confirm` with input:
  ```json
  {
    "paymentId": "?paymentId",
    "transactionId": "?transaction.id"
  }
  ```

---

### GetOrderDetailsAfterPaymentConfirm

**When:**
- `Payment/confirm`

**Then:**
- `Order/get` with input:
  ```json
  {
    "orderId": "?payment.orderId"
  }
  ```

---

### GetUserDetailsAfterPaymentConfirm

**When:**
- `Order/get`

**Then:**
- `User/get` with input:
  ```json
  {
    "userId": "?order.userId"
  }
  ```

---

### SendPaymentSuccessNotification

**When:**
- `User/get`

**Then:**
- `Notification/send` with input:
  ```json
  {
    "type": "email",
    "to": "?user.email",
    "template": "payment-success",
    "data": {
      "orderId": "?payment.orderId",
      "amount": "?payment.amount",
      "paymentId": "?paymentId"
    }
  }
  ```

---

### GetOrderDetailsAfterPaymentFail

**When:**
- `Payment/fail`

**Then:**
- `Order/get` with input:
  ```json
  {
    "orderId": "?payment.orderId"
  }
  ```
- `Order/cancel` with input:
  ```json
  {
    "orderId": "?payment.orderId"
  }
  ```

---

### GetUserDetailsAfterPaymentFail

**When:**
- `Order/get`

**Then:**
- `User/get` with input:
  ```json
  {
    "userId": "?order.userId"
  }
  ```

---

### SendPaymentFailureNotification

**When:**
- `User/get`

**Then:**
- `Notification/send` with input:
  ```json
  {
    "type": "email",
    "to": "?user.email",
    "template": "payment-failed",
    "data": {
      "orderId": "?payment.orderId",
      "reason": "?payment.failureReason"
    }
  }
  ```

---

### GetOrderDetailsAfterRefund

**When:**
- `Payment/refund`

**Then:**
- `Order/get` with input:
  ```json
  {
    "orderId": "?payment.orderId"
  }
  ```

---

### GetUserDetailsAfterRefund

**When:**
- `Order/get`

**Then:**
- `User/get` with input:
  ```json
  {
    "userId": "?order.userId"
  }
  ```

---

### SendRefundNotification

**When:**
- `User/get`

**Then:**
- `Notification/send` with input:
  ```json
  {
    "type": "email",
    "to": "?user.email",
    "template": "payment-refund",
    "data": {
      "orderId": "?payment.orderId",
      "amount": "?transaction.amount",
      "reason": "?transaction.reason"
    }
  }
  ```

---

<a name="eda-product-events"></a>
## Product Events

Source: [`packages/example-eda/src/plugins/products/syncs/product-events.sync.ts`](file:///Users/mastepanoski/projects/web/ai/legible-sync/packages/example-eda/src/plugins/products/syncs/product-events.sync.ts)

### PublishProductCreatedEvent

**When:**
- `Product/create`

**Then:**
- `EventBus/publish` with input:
  ```json
  {
    "event": "product.created",
    "data": {
      "productId": "?productId",
      "name": "?product.name",
      "sku": "?product.sku",
      "price": "?product.price",
      "category": "?product.category"
    }
  }
  ```

---

### PublishProductUpdatedEvent

**When:**
- `Product/update`

**Then:**
- `EventBus/publish` with input:
  ```json
  {
    "event": "product.updated",
    "data": {
      "productId": "?productId",
      "updates": "?updates"
    }
  }
  ```

---

### PublishProductDeactivatedEvent

**When:**
- `Product/deactivate`

**Then:**
- `EventBus/publish` with input:
  ```json
  {
    "event": "product.deactivated",
    "data": {
      "productId": "?productId"
    }
  }
  ```

---

<a name="eda-user-events"></a>
## User Events

Source: [`packages/example-eda/src/plugins/users/syncs/user-events.sync.ts`](file:///Users/mastepanoski/projects/web/ai/legible-sync/packages/example-eda/src/plugins/users/syncs/user-events.sync.ts)

### PublishUserRegisteredEvent

**When:**
- `User/register`

**Then:**
- `EventBus/publish` with input:
  ```json
  {
    "event": "user.registered",
    "data": {
      "userId": "?userId",
      "username": "?user.username",
      "email": "?user.email"
    }
  }
  ```

---

### PublishUserUpdatedEvent

**When:**
- `User/update`

**Then:**
- `EventBus/publish` with input:
  ```json
  {
    "event": "user.updated",
    "data": {
      "userId": "?userId",
      "updates": "?updates"
    }
  }
  ```

---

### PublishUserDeactivatedEvent

**When:**
- `User/deactivate`

**Then:**
- `EventBus/publish` with input:
  ```json
  {
    "event": "user.deactivated",
    "data": {
      "userId": "?userId"
    }
  }
  ```

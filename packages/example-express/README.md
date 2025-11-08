# @legible-sync/example-express

[![npm version](https://badge.fury.io/js/%40legible-sync%2Fexample-express.svg)](https://badge.fury.io/js/%40legible-sync%2Fexample-express)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Express.js REST API example demonstrating the LegibleSync framework in a web application.

## Running the Example

From the root of the monorepo, run:

```bash
npm run dev:express
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
```
POST /users          # Register new user
POST /login          # User login
```

### Articles
```
POST /articles               # Create article
POST /articles/:id/favorite  # Favorite article
DELETE /articles/:id/favorite # Unfavorite article
POST /articles/:id/comments  # Add comment
```

### Auditing
```
GET /audit/:flowId   # Get flow audit trail
```

## Example Usage

### Register User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "secure123"
  }'
```

### Create Article
```bash
curl -X POST http://localhost:3000/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My Article",
    "body": "Article content here..."
  }'
```

### Audit Flow
```bash
curl http://localhost:3000/audit/user-registration-flow
```

## Features Demonstrated

- **REST API Integration**: HTTP request/response handling
- **Authentication**: JWT-based auth with bcrypt passwords
- **CRUD Operations**: Full create/read/update/delete flows
- **Social Features**: Favorites and comments system
- **Flow Auditing**: Complete execution traceability
- **Error Handling**: Proper HTTP status codes and messages

## Code Structure

```
src/
├── concepts/          # Business logic modules
│   ├── User.ts       # User management
│   ├── Article.ts    # Article handling
│   ├── Comment.ts    # Comments system
│   ├── Favorite.ts   # Favorites functionality
│   ├── Password.ts   # Password validation
│   ├── JWT.ts        # JWT tokens
│   └── Web.ts        # HTTP abstraction
├── syncs/            # Synchronization rules
│   ├── registration.sync.ts
│   ├── article.sync.ts
│   ├── favorite.sync.ts
│   └── comment.sync.ts
├── utils/            # Utilities
│   └── audit.ts      # Flow auditing
└── server.ts         # Express server
```

## Learning Points

- Building REST APIs with LegibleSync
- Authentication and authorization patterns
- Social features implementation
- HTTP request/response handling
- API design with concepts and syncs

## Related Packages

- [@legible-sync/core](https://www.npmjs.com/package/@legible-sync/core) - Framework core
- [@legible-sync/example-console](https://www.npmjs.com/package/@legible-sync/example-console) - Console example

## License

MIT License - Copyright (c) 2025 Mauro Stepanoski

## Links

- [GitHub Repository](https://github.com/mastepanoski/legiblesync)
- [Framework Documentation](https://github.com/mastepanoski/legiblesync/tree/main/packages/core)
- [API Documentation](https://github.com/mastepanoski/legiblesync/tree/main/packages/example-express)
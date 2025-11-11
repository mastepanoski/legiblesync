# @legible-sync/example-nextjs-sse

Next.js example demonstrating Server-Sent Events (SSE) with LegibleSync framework.

## Features

- Real-time comment system using SSE
- Comments stored in CSV file
- Automatic logging of comment creation
- Next.js 14+ with App Router

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000/comments](http://localhost:3000/comments)

## API Endpoints

- `GET /api/comments` - Retrieve all comments
- `POST /api/comments` - Create a new comment
- `GET /api/comments/stream` - SSE stream for real-time updates
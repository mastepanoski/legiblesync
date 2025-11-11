// syncs/logging.sync.ts
import { SyncRule } from '@legible-sync/core';

export const loggingSyncs: SyncRule[] = [
  {
    name: "LogCommentCreation",
    when: [
      {
        concept: "Comment",
        action: "create",
        output: {
          timestamp: "?timestamp",
          nombre: "?nombre",
          comentario: "?comentario"
        }
      }
    ],
    then: [
      {
        concept: "Logger",
        action: "logCommentCreation",
        input: {
          timestamp: "?timestamp",
          nombre: "?nombre",
          comentario: "?comentario"
        }
      }
    ]
  }
];
// syncs/comment.sync.ts
import { SyncRule } from '@legible-sync/core';

export const commentSyncs: SyncRule[] = [
  {
    name: "CreateCommentAndNotify",
    when: [
      {
        concept: "Comment",
        action: "create",
        output: {
          commentId: "?commentId",
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
      },
      {
        concept: "CSVWriter",
        action: "appendComment",
        input: {
          timestamp: "?timestamp",
          nombre: "?nombre",
          comentario: "?comentario"
        }
      },
      {
        concept: "SSEEmitter",
        action: "emitNewComment",
        input: {
          timestamp: "?timestamp",
          nombre: "?nombre",
          comentario: "?comentario"
        }
      }
    ]
  }
];
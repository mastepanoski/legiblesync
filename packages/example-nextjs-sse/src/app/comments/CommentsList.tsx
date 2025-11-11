'use client';

import { useEffect, Dispatch, SetStateAction } from 'react';
import io from 'socket.io-client';

interface Comment {
  timestamp: string;
  name: string;
  comment: string;
}

interface Props {
  comments: Comment[];
  setComments: Dispatch<SetStateAction<Comment[]>>;
}

export default function CommentsList({ comments, setComments }: Props) {
  useEffect(() => {
    const socket = io();

    socket.on('new_comment', (data: Comment) => {
      setComments((prevComments) => [...prevComments, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [setComments]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment, index) => (
            <li key={index} className="border p-4 rounded">
              <div className="font-medium">{comment.name}</div>
              <div className="text-sm text-gray-600">{new Date(comment.timestamp).toLocaleString()}</div>
              <div className="mt-2">{comment.comment}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
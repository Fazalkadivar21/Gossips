import React from 'react';
import { Message } from '../types';
import { Check } from 'lucide-react';
import { formatMessageTime } from '../utils/dateUtils';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`message-bubble ${isOwn ? 'sent' : 'received'}`}>
        {message.type === 'text' && <p>{message.content}</p>}
        {message.type === 'image' && message.fileUrl && (
          <img 
            src={`http://localhost:5000/${message.fileUrl}`} 
            alt="Shared" 
            className="max-w-full rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
            }}
          />
        )}
        {message.type === 'file' && message.fileUrl && (
          <a
            href={`http://localhost:5000/${message.fileUrl}`}
            className="text-emerald-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {message.content}
          </a>
        )}
        <div className="flex items-center justify-end space-x-1 mt-1">
          <span className="text-xs text-gray-500">
            {formatMessageTime(message.timestamp)}
          </span>
          {isOwn && (
            <Check className="w-4 h-4 text-emerald-500" />
          )}
        </div>
      </div>
    </div>
  );
};

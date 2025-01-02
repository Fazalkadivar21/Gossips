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
        {message.type === 'image' && (
          <img src={message.fileUrl} alt="Shared" className="max-w-full rounded" />
        )}
        {message.type === 'file' && (
          <a
            href={message.fileUrl}
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
}
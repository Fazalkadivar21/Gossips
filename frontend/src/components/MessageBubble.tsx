import React from 'react';
import { Message } from '../types';
import { Check, FileText, Download } from 'lucide-react';
import { formatMessageTime } from '../utils/dateUtils';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="relative group">
            <img 
              src={message.fileUrl ? `http://localhost:5000/backend/uploads/${message.content}` : ''}
              alt="Shared"
              className="max-w-[300px] max-h-[300px] rounded-lg object-cover cursor-pointer"
              onClick={() => window.open(`http://localhost:5000/backend/uploads/${message.content}`, '_blank')}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-discord-dark-600 p-3 rounded-lg">
            <FileText className="w-8 h-8 text-discord-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.content}</p>
              <a
                href={`http://localhost:5000/backend/uploads/${message.content}`}
                className="text-xs text-discord-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
            </div>
          </div>
        );
      default:
        return <p>{message.content}</p>;
    }
  };

  return (
    <motion.div 
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
      initial={{ 
        opacity: 0, 
        x: isOwn ? 20 : -20,
        scale: 0.95
      }}
      animate={{ 
        opacity: 1, 
        x: 0,
        scale: 1
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 40
      }}
    >
      <div className={`message-bubble ${isOwn ? 'sent' : 'received'}`}>
        {renderContent()}
        <div className="flex items-center justify-end space-x-1 mt-1">
          <span className="text-xs text-gray-500">
            {formatMessageTime(message.timestamp)}
          </span>
          {isOwn && (
            <Check className="w-4 h-4 text-emerald-500" />
          )}
        </div>
      </div>
    </motion.div>
  );
};
import React from 'react';
import { Message, User } from '../types';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';

interface ChatWindowProps {
  currentUser: User;
  selectedUser: User | null;
  messages: Message[];
  onSendMessage: (content: string, type: 'text' | 'image' | 'file', file?: File) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  currentUser,
  selectedUser,
  messages,
  onSendMessage,
}) => {
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-discord-dark-700">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader user={selectedUser} />
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-discord-dark-700"
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUser.id}
          />
        ))}
      </div>
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}
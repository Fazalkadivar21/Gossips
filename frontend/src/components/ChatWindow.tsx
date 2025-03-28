import React, { useEffect, useRef, useState } from 'react';
import { Message, User } from '../types';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';

interface ChatWindowProps {
  currentUser: User;
  selectedUser: User | null;
  messages: Message[];
  onSendMessage: (content: string, type: 'text' | 'image' | 'file', file?: File) => void;
  loading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  currentUser,
  selectedUser,
  messages,
  onSendMessage,
  loading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Handle scroll events to determine if we should auto-scroll
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
    setShouldAutoScroll(isNearBottom);
  };

  // Auto-scroll to bottom when new messages arrive (if shouldAutoScroll is true)
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll]);

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
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-discord-dark-700"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-discord-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUser.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};
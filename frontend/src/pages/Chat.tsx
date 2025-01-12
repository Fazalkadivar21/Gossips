import React, { useState, useEffect } from 'react';
import { User, Message } from '../types';
import { ChatWindow } from '../components/ChatWindow';
import { UserList } from '../components/UserList';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';

export const Chat: React.FC = () => {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Load messages function that will be called repeatedly
  const loadMessages = async () => {
    if (!user || !selectedUser) return;

    try {
      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('other_user_id', selectedUser.id);

      const { data } = await api.post('/backend/loadChat.php', formData);
      
      if (Array.isArray(data)) {
        const formattedMessages = data.map((msg: any) => ({
          id: msg.id,
          senderId: msg.sender_id,
          receiverId: msg.receiver_id,
          content: msg.message,
          timestamp: new Date(msg.timestamp),
          type: msg.type || 'text',
          fileUrl: msg.file_path
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  // Initial load and polling setup
  useEffect(() => {
    if (!selectedUser) return;
    
    // Initial load
    setLoading(true);
    loadMessages().finally(() => setLoading(false));

    // Set up polling interval
    const pollInterval = setInterval(loadMessages, 1000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [selectedUser]);

  const handleSendMessage = async (content: string, type: 'text' | 'image' | 'file', file?: File) => {
    if (!user || !selectedUser) return;

    try {
      const formData = new FormData();
      formData.append('sender_id', user.id);
      formData.append('receiver_id', selectedUser.id);
      formData.append('content', content);
      formData.append('type', type);
      if (file) {
        formData.append('file', file);
      }

      const { data } = await api.post('/backend/sendMessage.php', formData);

      if (data.success) {
        // After successful send, load messages again to get the latest state
        loadMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-discord-dark-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[400px] flex flex-col bg-white dark:bg-discord-dark-800 border-r border-gray-200 dark:border-discord-dark-900">
          <UserList
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
          />
        </div>
        <div className="flex-1">
          <ChatWindow
            currentUser={user!}
            selectedUser={selectedUser}
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

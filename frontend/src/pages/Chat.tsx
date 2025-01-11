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

  // Fetch messages when user selects a chat
  useEffect(() => {
    const loadMessages = async () => {
      if (!user || !selectedUser) return;
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append('test1', user.id);
        formData.append('test2', selectedUser.id);

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
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [user, selectedUser]);

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

      const { data } = await api.post('backend/sendMessage.php', formData);

      if (data.success) {
        const newMessage: Message = {
          id: data.message_id,
          senderId: user.id,
          receiverId: selectedUser.id,
          content,
          timestamp: new Date(),
          type,
          fileUrl: data.file_url
        };
        setMessages(prev => [...prev, newMessage]);
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

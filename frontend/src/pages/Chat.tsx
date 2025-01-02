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
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadChatList = async () => {
      try {
        const formData = new FormData();
        formData.append('user_id', user?.id || '');

        const { data } = await api.post('/backend/loadChatList.php', formData);
        
        if (Array.isArray(data)) {
          setUsers(data.map((chat: any) => ({
            id: chat.other_user_id,
            username: chat.other_user_username,
            email: '',
            isOnline: true,
            avatar: chat.profile_picture,
            lastSeen: new Date(chat.last_message_time)
          })));
        }
      } catch (error) {
        console.error('Failed to load chat list:', error);
      }
    };

    if (user) {
      loadChatList();
    }
  }, [user]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!user || !selectedUser) return;

      try {
        const formData = new FormData();
        formData.append('user_id', user.id);
        formData.append('other_user_id', selectedUser.id);

        const { data } = await api.post('/backend/loadChat.php', formData);
        
        if (Array.isArray(data)) {
          setMessages(data.map((msg: any) => ({
            id: msg.id,
            senderId: msg.sender_id,
            receiverId: msg.receiver_id,
            content: msg.message,
            timestamp: new Date(msg.timestamp),
            type: msg.type,
            fileUrl: msg.file_path
          })));
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
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

      const { data } = await api.post('/backend/sendMessage.php', formData);

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
          <div className="p-3 bg-gray-100 dark:bg-discord-dark-800 border-b border-gray-200 dark:border-discord-dark-900">
            <input
              type="text"
              placeholder="Search or start new chat"
              className="w-full p-2 bg-white dark:bg-discord-dark-600 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-discord-primary dark:focus:ring-discord-primary placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <UserList
            users={users}
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
          />
        </div>
      </div>
    </div>
  );
};

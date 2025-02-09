import React, { useState, useEffect, useCallback } from 'react';
import { User, Message } from '../types';
import { ChatWindow } from '../components/ChatWindow';
import { UserList } from '../components/UserList';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';

export const Chat: React.FC = () => {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Load messages
  const loadMessages = useCallback(async () => {
    if (!user || !selectedUser) return;

    try {
      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('other_user_id', selectedUser.id);

      const response = await api.post('/backend/loadChat.php', formData);
      console.log('Load messages response:', response.data); // Debug log

      // Check if response.data is a string (error message)
      if (typeof response.data === 'string') {
        if (response.data !== 'No messages found.') {
          console.error('Server error:', response.data);
        }
        return;
      }
      
      // Ensure we have an array of messages
      const messageData = Array.isArray(response.data) ? response.data : [];
      
      const formattedMessages = messageData.map((msg: any) => ({
        id: msg.id.toString(),
        senderId: msg.sender_id,
        receiverId: msg.receiver_id,
        content: msg.message,
        timestamp: new Date(msg.timestamp),
        type: msg.type || 'text',
        fileUrl: msg.file_path
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, [user, selectedUser]);

  // Initial load and interval setup
  useEffect(() => {
    if (!selectedUser) return;

    setLoading(true);
    loadMessages().finally(() => setLoading(false));

    // Set up interval to load messages every second
    const interval = setInterval(loadMessages, 1000);

    return () => {
      clearInterval(interval);
      setMessages([]);
    };
  }, [selectedUser, loadMessages]);

  const handleSendMessage = async (content: string, type: 'text' | 'image' | 'file', file?: File) => {
    if (!user || !selectedUser) return;

    try {
      const formData = new FormData();
      formData.append('sender_id', user.id);
      formData.append('receiver_id', selectedUser.id);
      formData.append('message', content);
      formData.append('type', type);
      
      if (file) {
        formData.append('file', file);
      }

      // Add optimistic update
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: user.id,
        receiverId: selectedUser.id,
        content,
        timestamp: new Date(),
        type,
        fileUrl: file ? URL.createObjectURL(file) : undefined
      };

      setMessages(prev => [...prev, optimisticMessage]);

      // Send the message
      const response = await api.post('/backend/sendMessage.php', formData);
      console.log('Send message response:', response.data); // Debug log

      if (response.data.error || (typeof response.data.message === 'string' && response.data.message.includes('Error'))) {
        // Remove optimistic message if there was an error
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        console.error('Failed to send message:', response.data.message || response.data.error);
        return;
      }

      // Force reload messages to get the real message with server ID
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove the optimistic message if there was an error
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex flex-col bg-gray-50 dark:bg-discord-dark-900"
    >
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-[400px] flex flex-col bg-white dark:bg-discord-dark-800 border-r border-gray-200 dark:border-discord-dark-900"
        >
          <UserList
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
          />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedUser?.id || 'empty'}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex-1"
          >
            <ChatWindow
              currentUser={user!}
              selectedUser={selectedUser}
              messages={messages}
              onSendMessage={handleSendMessage}
              loading={loading}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
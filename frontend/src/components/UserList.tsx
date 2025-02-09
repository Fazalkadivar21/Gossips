import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { formatLastSeen } from '../utils/dateUtils';
import { Search } from 'lucide-react';
import api from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface UserListProps {
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
}

export const UserList: React.FC<UserListProps> = ({ selectedUser, onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { user: currentUser } = useAuth();

  // Fetch chat list (recent conversations)
  useEffect(() => {
    const fetchChatList = async () => {
      if (!currentUser) return;
      
      try {
        const formData = new FormData();
        formData.append('user_id', currentUser.id);

        const { data } = await api.post('/backend/loadChatList.php', formData);
        
        if (Array.isArray(data)) {
          // Create a Map to store unique users by ID
          const uniqueUsers = new Map();
          
          data.forEach((chat: any) => {
            if (!uniqueUsers.has(chat.other_user_id)) {
              uniqueUsers.set(chat.other_user_id, {
                id: chat.other_user_id,
                username: chat.other_user_username,
                email: '',
                isOnline: chat.is_online,
                avatar: chat.profile_picture ? `http://localhost:5000/${chat.profile_picture}` : null,
                lastSeen: new Date(chat.last_active || chat.last_message_time)
              });
            }
          });
          
          setUsers(Array.from(uniqueUsers.values()));
        }
      } catch (error) {
        console.error('Failed to load chat list:', error);
      }
    };

    fetchChatList();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchChatList, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Search users
  const searchUsers = async (query: string) => {
    if (!query.trim() || !currentUser) return;
    
    setIsSearching(true);
    try {
      const formData = new FormData();
      formData.append('query', query);
      formData.append('user_id', currentUser.id);

      const { data } = await api.post('/search_users.php', formData);
      
      if (Array.isArray(data)) {
        // Create a Map to store unique users by ID
        const uniqueUsers = new Map();
        
        data.forEach((user: any) => {
          if (!uniqueUsers.has(user.id)) {
            uniqueUsers.set(user.id, {
              id: user.id,
              username: user.username,
              email: '',
              isOnline: user.is_online,
              avatar: user.profile_picture ? `http://localhost:5000/${user.profile_picture}` : null,
              lastSeen: new Date(user.last_active)
            });
          }
        });
        
        setUsers(Array.from(uniqueUsers.values()));
      }
    } catch (error) {
      console.error('Failed to search users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchUsers(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-discord-dark-800">
      <div className="p-3 bg-gray-100 dark:bg-discord-dark-800 border-b border-gray-200 dark:border-discord-dark-900">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-9 bg-white dark:bg-discord-dark-600 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-discord-primary dark:focus:ring-discord-primary placeholder-gray-500 dark:placeholder-gray-400"
          />
          <Search className="w-5 h-5 absolute left-2 top-2.5 text-gray-400" />
          {isSearching && (
            <div className="absolute right-2 top-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-discord-primary"></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {users.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 text-center text-gray-500 dark:text-gray-400"
            >
              {searchQuery ? 'No users found' : 'No recent chats'}
            </motion.div>
          ) : (
            users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
                onClick={() => onSelectUser(user)}
                className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-discord-dark-700 border-b dark:border-discord-dark-900 ${
                  selectedUser?.id === user.id ? 'bg-gray-50 dark:bg-discord-dark-700' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <motion.img
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {user.isOnline && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-discord-dark-800"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold dark:text-gray-100">{user.username}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatLastSeen(user.lastSeen)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.isOnline ? 'online' : 'last seen recently'}
                    </p>``
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
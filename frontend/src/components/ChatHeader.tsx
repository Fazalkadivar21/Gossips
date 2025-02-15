import React from 'react';
import { User } from '../types';
import { Phone, Video, MoreVertical } from 'lucide-react';
import { useCall } from '../contexts/CallContext';
import { motion } from 'framer-motion';

interface ChatHeaderProps {
  user: User;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ user }) => {
  const { makeCall, isInCall } = useCall();

  return (
    <div className="bg-white dark:bg-discord-dark-800 p-4 border-b border-gray-200 dark:border-discord-dark-900 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <motion.img
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
          alt={user.username}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{user.username}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.isOnline ? 'online' : 'last seen recently'}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => makeCall(user, false)}
          disabled={isInCall}
          className={`p-3 rounded-full transition-colors ${
            isInCall
              ? 'bg-red-500 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-discord-dark-700 text-gray-600 dark:text-gray-400'
          }`}
        >
          <Phone className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => makeCall(user, true)}
          disabled={isInCall}
          className={`p-3 rounded-full transition-colors ${
            isInCall
              ? 'bg-red-500 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-discord-dark-700 text-gray-600 dark:text-gray-400'
          }`}
        >
          <Video className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-discord-dark-700 text-gray-600 dark:text-gray-400"
        >
          <MoreVertical className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};
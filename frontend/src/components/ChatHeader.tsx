import React from 'react';
import { User } from '../types';
import { MoreVertical, Phone, Video } from 'lucide-react';

interface ChatHeaderProps {
  user: User;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ user }) => {
  return (
    <div className="bg-white dark:bg-discord-dark-800 p-3 border-b border-gray-200 dark:border-discord-dark-900 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img
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
      <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
        <Video className="w-5 h-5 cursor-pointer hover:text-discord-primary dark:hover:text-discord-primary" />
        <Phone className="w-5 h-5 cursor-pointer hover:text-discord-primary dark:hover:text-discord-primary" />
        <MoreVertical className="w-5 h-5 cursor-pointer hover:text-discord-primary dark:hover:text-discord-primary" />
      </div>
    </div>
  );
}
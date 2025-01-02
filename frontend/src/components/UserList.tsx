import React from 'react';
import { User } from '../types';
import { formatLastSeen } from '../utils/dateUtils';

interface UserListProps {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, selectedUser, onSelectUser }) => {
  return (
    <div className="bg-white dark:bg-discord-dark-800">
      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => onSelectUser(user)}
          className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-discord-dark-700 border-b dark:border-discord-dark-900 ${
            selectedUser?.id === user.id ? 'bg-gray-50 dark:bg-discord-dark-700' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                alt={user.username}
                className="w-12 h-12 rounded-full"
              />
              {user.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-discord-dark-800" />
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
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
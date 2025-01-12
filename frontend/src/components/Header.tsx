import React, { useState } from 'react';
import { Menu, Search, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-[#5865F2] dark:bg-[#36393f] text-white p-4 flex items-center justify-between relative">
      <h1 className="text-xl font-semibold">Chat App</h1>
      <div className="flex items-center space-x-4">
        <Search className="w-5 h-5 cursor-pointer" />
        <ThemeToggle />
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="focus:outline-none"
        >
          <Menu className="w-5 h-5 cursor-pointer" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-full right-2 mt-1 bg-white dark:bg-discord-dark-800 rounded-lg shadow-lg py-2 min-w-[160px] z-50">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-discord-dark-700 flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

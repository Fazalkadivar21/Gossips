import React from 'react';
import { Menu, Search } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  return (
    <div className="bg-[#5865F2] dark:bg-[#36393f] text-white p-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold">Chat App</h1>
      <div className="flex items-center space-x-4">
        <Search className="w-5 h-5 cursor-pointer" />
        <ThemeToggle />
        <Menu className="w-5 h-5 cursor-pointer" />
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Paperclip, Send, Smile } from 'lucide-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

interface MessageInputProps {
  onSendMessage: (content: string, type: 'text' | 'image' | 'file', file?: File) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        setShowEmojiPicker((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message, 'text');
      setMessage('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      onSendMessage(file.name, isImage ? 'image' : 'file', file);
    }
  };

  const addEmoji = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
  };

  return (
    <div className="relative bg-gray-100 dark:bg-discord-dark-800 p-3">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 relative">
          <div className="relative">
            <Smile 
              className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            {showEmojiPicker && (
              <div className="absolute bottom-10 left-0 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <Picker data={data} onEmojiSelect={addEmoji} theme="dark" />
              </div>
            )}
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx"
            />
            <Paperclip className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </label>
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 p-2 rounded-lg bg-white dark:bg-discord-dark-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-discord-primary"
        />
        <button
          type="submit"
          className="p-2 rounded-full bg-discord-primary text-white hover:bg-discord-primary/90"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
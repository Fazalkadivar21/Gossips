import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, Upload } from 'lucide-react';

export const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signup(username, email, password, profilePicture || undefined);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-discord-dark-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-discord-dark-800 p-8 rounded-lg shadow-md">
        <div className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-discord-primary" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Create an account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join our chat community
          </p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-discord-dark-600 border border-gray-300 dark:border-discord-dark-900 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-discord-primary focus:border-discord-primary"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-discord-dark-600 border border-gray-300 dark:border-discord-dark-900 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-discord-primary focus:border-discord-primary"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-discord-dark-600 border border-gray-300 dark:border-discord-dark-900 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-discord-primary focus:border-discord-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Picture
              </label>
              <div className="mt-1 flex flex-col items-center space-y-4">
                {previewUrl ? (
                  <div className="relative group">
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => {
                        setPreviewUrl(null);
                        setProfilePicture(null);
                      }}
                    >
                      <span className="text-white text-sm">Remove</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-gray-300 dark:border-discord-dark-900 border-dashed rounded-full cursor-pointer hover:border-discord-primary dark:hover:border-discord-primary">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">Upload</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-discord-primary hover:bg-discord-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-discord-primary disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
            <Link to="/login" className="font-medium text-discord-primary hover:text-discord-primary/90">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

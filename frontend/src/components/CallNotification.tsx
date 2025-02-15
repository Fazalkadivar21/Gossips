import React from 'react';
import { Phone, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCall } from '../contexts/CallContext';

export const CallNotification: React.FC = () => {
  const { incomingCall, answerCall } = useCall();

  if (!incomingCall) return null;

  const isVideoCall = incomingCall.metadata?.isVideo;
  const callerName = incomingCall.metadata?.callerName || 'Unknown';

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 right-4 bg-white dark:bg-discord-dark-800 p-4 rounded-lg shadow-lg z-50"
    >
      <div className="flex items-center space-x-4">
        <div className="bg-discord-primary rounded-full p-3">
          {isVideoCall ? (
            <Video className="w-6 h-6 text-white" />
          ) : (
            <Phone className="w-6 h-6 text-white" />
          )}
        </div>
        <div>
          <h3 className="font-semibold dark:text-white">Incoming {isVideoCall ? 'Video' : 'Audio'} Call</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">from {callerName}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => answerCall(incomingCall)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Answer
        </button>
      </div>
    </motion.div>
  );
};
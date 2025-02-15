import React from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import { useCall } from '../contexts/CallContext';
import { motion } from 'framer-motion';

export const CallControls: React.FC = () => {
  const { toggleVideo, toggleAudio, endCall, isVideo, isMuted } = useCall();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-900/80 p-4 rounded-full backdrop-blur-sm"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleVideo}
        className="p-4 rounded-full hover:bg-gray-700 transition-colors"
      >
        {isVideo ? (
          <Video className="w-6 h-6 text-white" />
        ) : (
          <VideoOff className="w-6 h-6 text-white" />
        )}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleAudio}
        className="p-4 rounded-full hover:bg-gray-700 transition-colors"
      >
        {isMuted ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={endCall}
        className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
      >
        <PhoneOff className="w-6 h-6 text-white" />
      </motion.button>
    </motion.div>
  );
};
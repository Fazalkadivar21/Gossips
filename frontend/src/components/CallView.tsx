import React, { useEffect, useRef } from 'react';
import { useCall } from '../contexts/CallContext';
import { CallControls } from './CallControls';
import { motion, AnimatePresence } from 'framer-motion';

export const CallView: React.FC = () => {
  const { localStream, remoteStream, isInCall, isVideo, caller } = useCall();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (!isInCall) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      >
        <div className="relative w-full h-full">
          {/* Remote Video/Audio Stream */}
          {isVideo ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-discord-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl text-white">
                    {caller?.username?.[0]?.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl text-white font-semibold">
                  {caller?.username}
                </h2>
                <p className="text-gray-400">Audio Call</p>
              </div>
            </div>
          )}

          {/* Local Video Stream (if video is enabled) */}
          {localStream && isVideo && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="absolute bottom-24 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-lg border-2 border-white/20"
              drag
              dragConstraints={{
                top: 0,
                left: 0,
                right: window.innerWidth - 192, // 48rem = 192px
                bottom: window.innerHeight - 144, // 36rem = 144px
              }}
            >
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Call Controls */}
          <CallControls />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
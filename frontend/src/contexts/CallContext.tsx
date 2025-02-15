import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import { User } from '../types';
import { socket, registerUser, initiateCall, acceptCall, rejectCall, endCall as endCallSocket, onIncomingCall, onCallAccepted, onCallRejected, onCallEnded } from '../lib/socket';

interface CallContextType {
  makeCall: (user: User, isVideo: boolean) => void;
  answerCall: (call: MediaConnection) => void;
  endCall: () => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  incomingCall: MediaConnection | null;
  isInCall: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isVideo: boolean;
  isMuted: boolean;
  caller: User | null;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode; currentUser: User | null }> = ({
  children,
  currentUser
}) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [incomingCall, setIncomingCall] = useState<MediaConnection | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideo, setIsVideo] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [caller, setCaller] = useState<User | null>(null);
  
  const currentCallRef = useRef<MediaConnection | null>(null);
  const peerRef = useRef<Peer | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    // Initialize PeerJS
    const newPeer = new Peer(currentUser.id, {
      host: 'localhost',
      port: 9000,
      path: '/',
      debug: 3
    });

    newPeer.on('open', (id) => {
      console.log('PeerJS connection established with ID:', id);
      setPeer(newPeer);
      // Register user with Socket.IO
      registerUser({
        id: currentUser.id,
        username: currentUser.username
      });
    });

    newPeer.on('call', (call) => {
      console.log('Incoming call from:', call.metadata);
      setIncomingCall(call);
    });

    peerRef.current = newPeer;

    // Socket.IO event listeners
    onIncomingCall(({ callerId, callerName, isVideo }) => {
      console.log('Incoming call notification:', { callerId, callerName, isVideo });
      setCaller({
        id: callerId,
        username: callerName,
        email: '',
        isOnline: true
      });
    });

    onCallAccepted(({ accepterId }) => {
      console.log('Call accepted by:', accepterId);
    });

    onCallRejected(({ rejecterId }) => {
      console.log('Call rejected by:', rejecterId);
      endCall();
    });

    onCallEnded(({ enderId }) => {
      console.log('Call ended by:', enderId);
      endCall();
    });

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [currentUser]);

  const getMediaStream = async (video: boolean) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } : false,
        audio: true
      });
      return stream;
    } catch (err) {
      console.error('Failed to get media stream:', err);
      return null;
    }
  };

  const makeCall = async (user: User, withVideo: boolean) => {
    if (!peerRef.current || !currentUser) return;

    try {
      const stream = await getMediaStream(withVideo);
      if (!stream) return;

      setLocalStream(stream);
      setIsVideo(withVideo);
      setIsInCall(true);

      // Notify through Socket.IO
      initiateCall(user.id, currentUser.id, currentUser.username, withVideo);

      const call = peerRef.current.call(user.id, stream, {
        metadata: { 
          callerId: currentUser.id,
          callerName: currentUser.username,
          isVideo: withVideo
        }
      });

      currentCallRef.current = call;
      setupCallEventHandlers(call);
      setCaller(currentUser);
    } catch (err) {
      console.error('Error making call:', err);
      endCall();
    }
  };

  const answerCall = async (call: MediaConnection) => {
    if (!currentUser) return;

    try {
      const isVideoCall = call.metadata?.isVideo;
      const stream = await getMediaStream(isVideoCall);
      if (!stream) return;

      setLocalStream(stream);
      setIsVideo(isVideoCall);
      setIsInCall(true);
      
      call.answer(stream);
      currentCallRef.current = call;
      setupCallEventHandlers(call);
      setIncomingCall(null);

      // Notify through Socket.IO
      acceptCall(call.metadata.callerId, currentUser.id);
      
      if (call.metadata?.callerId && call.metadata?.callerName) {
        setCaller({
          id: call.metadata.callerId,
          username: call.metadata.callerName,
          email: '',
          isOnline: true
        });
      }
    } catch (err) {
      console.error('Error answering call:', err);
      endCall();
    }
  };

  const setupCallEventHandlers = (call: MediaConnection) => {
    call.on('stream', (remoteMediaStream) => {
      setRemoteStream(remoteMediaStream);
    });

    call.on('close', () => {
      endCall();
    });

    call.on('error', (err) => {
      console.error('Call error:', err);
      endCall();
    });
  };

  const endCall = () => {
    if (currentCallRef.current && caller) {
      currentCallRef.current.close();
      // Notify through Socket.IO
      endCallSocket(caller.id, currentUser?.id || '');
    }
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    setLocalStream(null);
    setRemoteStream(null);
    setIsInCall(false);
    setIncomingCall(null);
    setCaller(null);
    currentCallRef.current = null;
  };

  const toggleVideo = async () => {
    if (!localStream) return;

    if (isVideo) {
      localStream.getVideoTracks().forEach(track => {
        track.stop();
      });
      setIsVideo(false);
    } else {
      try {
        const newStream = await getMediaStream(true);
        if (newStream && currentCallRef.current) {
          currentCallRef.current.peerConnection?.getSenders().forEach(sender => {
            if (sender.track?.kind === 'video') {
              const videoTrack = newStream.getVideoTracks()[0];
              sender.replaceTrack(videoTrack);
            }
          });
          setLocalStream(newStream);
          setIsVideo(true);
        }
      } catch (err) {
        console.error('Error toggling video:', err);
      }
    }
  };

  const toggleAudio = () => {
    if (!localStream) return;
    
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  return (
    <CallContext.Provider
      value={{
        makeCall,
        answerCall,
        endCall,
        toggleVideo,
        toggleAudio,
        incomingCall,
        isInCall,
        localStream,
        remoteStream,
        isVideo,
        isMuted,
        caller
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

export const registerUser = (userData: { id: string; username: string }) => {
  socket.emit('register-user', userData);
};

export const initiateCall = (targetUserId: string, callerId: string, callerName: string, isVideo: boolean) => {
  socket.emit('call-user', { targetUserId, callerId, callerName, isVideo });
};

export const acceptCall = (targetUserId: string, accepterId: string) => {
  socket.emit('call-accepted', { targetUserId, accepterId });
};

export const rejectCall = (targetUserId: string, rejecterId: string) => {
  socket.emit('call-rejected', { targetUserId, rejecterId });
};

export const endCall = (targetUserId: string, enderId: string) => {
  socket.emit('call-ended', { targetUserId, enderId });
};

// Event listeners
export const onIncomingCall = (callback: (data: { callerId: string; callerName: string; isVideo: boolean }) => void) => {
  socket.on('incoming-call', callback);
};

export const onCallAccepted = (callback: (data: { accepterId: string }) => void) => {
  socket.on('call-accepted', callback);
};

export const onCallRejected = (callback: (data: { rejecterId: string }) => void) => {
  socket.on('call-rejected', callback);
};

export const onCallEnded = (callback: (data: { enderId: string }) => void) => {
  socket.on('call-ended', callback);
};

export const onUsersUpdated = (callback: (users: Array<{ id: string; username: string; isOnline: boolean }>) => void) => {
  socket.on('users-updated', callback);
};
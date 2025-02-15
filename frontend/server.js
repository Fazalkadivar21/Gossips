import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PeerServer } from 'peer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Enable CORS
app.use(cors());

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Create PeerJS server
const peerServer = PeerServer({
  port: 9000,
  path: '/',
  proxied: true
});

// Store connected users
const connectedUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user registration
  socket.on('register-user', (userData) => {
    console.log('User registered:', userData);
    connectedUsers.set(userData.id, {
      socket: socket.id,
      ...userData
    });
    
    // Broadcast updated user list
    io.emit('users-updated', Array.from(connectedUsers.values()).map(user => ({
      id: user.id,
      username: user.username,
      isOnline: true
    })));
  });

  // Handle call initiation
  socket.on('call-user', ({ targetUserId, callerId, callerName, isVideo }) => {
    const targetUser = connectedUsers.get(targetUserId);
    if (targetUser) {
      io.to(targetUser.socket).emit('incoming-call', {
        callerId,
        callerName,
        isVideo
      });
    }
  });

  // Handle call acceptance
  socket.on('call-accepted', ({ targetUserId, accepterId }) => {
    const targetUser = connectedUsers.get(targetUserId);
    if (targetUser) {
      io.to(targetUser.socket).emit('call-accepted', { accepterId });
    }
  });

  // Handle call rejection
  socket.on('call-rejected', ({ targetUserId, rejecterId }) => {
    const targetUser = connectedUsers.get(targetUserId);
    if (targetUser) {
      io.to(targetUser.socket).emit('call-rejected', { rejecterId });
    }
  });

  // Handle call ended
  socket.on('call-ended', ({ targetUserId, enderId }) => {
    const targetUser = connectedUsers.get(targetUserId);
    if (targetUser) {
      io.to(targetUser.socket).emit('call-ended', { enderId });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find and remove disconnected user
    for (const [userId, user] of connectedUsers.entries()) {
      if (user.socket === socket.id) {
        connectedUsers.delete(userId);
        // Broadcast updated user list
        io.emit('users-updated', Array.from(connectedUsers.values()).map(user => ({
          id: user.id,
          username: user.username,
          isOnline: true
        })));
        break;
      }
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`PeerJS server running on port 9000`);
});
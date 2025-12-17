// utils/socketHelper.js
// Helper để emit Socket.IO events một cách an toàn

let ioInstance = null;

/**
 * Set Socket.IO instance
 */
export function setSocketIO(io) {
  ioInstance = io;
  console.log('✅ Socket.IO instance set in helper');
}

/**
 * Get Socket.IO instance
 */
export function getSocketIO() {
  return ioInstance;
}

/**
 * Emit event an toàn (không crash nếu io null)
 */
export function emitToAdmin(event, data) {
  try {
    if (ioInstance && typeof ioInstance.to === 'function') {
      ioInstance.to('admin').emit(event, data);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Socket emit error:', error.message);
    return false;
  }
}

/**
 * Emit event cho user cụ thể
 */
export function emitToUser(userId, event, data) {
  try {
    if (ioInstance && typeof ioInstance.to === 'function') {
      ioInstance.to(`user-${userId}`).emit(event, data);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Socket emit error:', error.message);
    return false;
  }
}

/**
 * Broadcast to all
 */
export function broadcast(event, data) {
  try {
    if (ioInstance && typeof ioInstance.emit === 'function') {
      ioInstance.emit(event, data);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Socket emit error:', error.message);
    return false;
  }
}

export default {
  setSocketIO,
  getSocketIO,
  emitToAdmin,
  emitToUser,
  broadcast
};
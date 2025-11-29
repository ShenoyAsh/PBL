import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from 'axios';

const NotificationContext = createContext();

// Socket.IO connection
const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
let socket;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      // Connect to socket server
      socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket'],
      });

      // Connection established
      socket.on('connect', () => {
        console.log('Connected to notification server');
        setIsConnected(true);
        
        // Register user with socket server
        socket.emit('register', user._id);
      });

      // Handle incoming notifications
      socket.on('notification', (notification) => {
        console.log('New notification:', notification);
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Disconnected from notification server');
        setIsConnected(false);
      });

      // Load existing notifications
      fetchNotifications();
    }

    // Cleanup on unmount or when user changes
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isAuthenticated, user?._id]);

  // Fetch notifications from the server
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications', {
        withCredentials: true,
      });
      setNotifications(response.data);
      
      // Update unread count
      const unread = response.data.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `/api/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      
      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      
      // Update unread count
      if (notifications.find(n => n._id === notificationId && !n.read)) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Emit read event to server
      if (socket) {
        socket.emit('notification:read', notificationId);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.patch(
        '/api/notifications/read-all',
        {},
        { withCredentials: true }
      );
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete a notification
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/api/notifications/${notificationId}`, {
        withCredentials: true,
      });
      
      // Update local state
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      
      // Update unread count if needed
      const notification = notifications.find(n => n._id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isConnected,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  unreadCount: number;
  incrementUnread: () => void;
  resetUnread: () => void;
  socket: Socket | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem('token');
    const socketUrl = import.meta.env.VITE_SOCKET_URL ?? window.location.origin;
    const s = io(socketUrl, { auth: { token }, transports: ['websocket', 'polling'] });

    s.on('notification', () => setUnreadCount((c: number) => c + 1));
    setSocket(s);

    return () => { s.disconnect(); };
  }, [isAuthenticated, user]);

  const incrementUnread = useCallback(() => setUnreadCount((c: number) => c + 1), []);
  const resetUnread = useCallback(() => setUnreadCount(0), []);

  return (
    <NotificationContext.Provider value={{ unreadCount, incrementUnread, resetUnread, socket }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be within NotificationProvider');
  return ctx;
}

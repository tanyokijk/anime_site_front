import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings } from "lucide-react";
import { createPortal } from "react-dom";
import { useAuth, createAuthenticatedFetch } from "@/contexts/auth-context";
import { API_BASE_URL } from "@/config";

interface Notification {
  id: string;
  data: {
    message: string;
    url: string;
  };
  created_at: string;
  read_at: string | null;
}

interface Props {
  isOpen: boolean; // Renamed from 'open' to avoid conflict with window.open
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onNotificationsRead?: () => void; // Add callback for when notifications are read
}

const NotificationModal: React.FC<Props> = ({ isOpen, onClose, anchorRef, onNotificationsRead }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const { token, isAuthenticated } = useAuth();

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch notifications when modal opens
  useEffect(() => {
    if (!isOpen || !isAuthenticated || !token) return;

    async function fetchNotifications() {
      try {
        // Add null check for token
        if (!token) return;
        
        const authenticatedFetch = createAuthenticatedFetch(token);
        const response = await authenticatedFetch(`${API_BASE_URL}notifications`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        
        const data = await response.json();
        setNotifications(data);
      } catch (e) {
        console.error("Failed to fetch notifications", e);
      }
    }

    fetchNotifications();
  }, [isOpen, isAuthenticated, token]);

  // Position calculation relative to button
  useEffect(() => {
    function updatePos() {
      if (isOpen && anchorRef.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        setPos({ top: rect.bottom + 10, left: rect.right - 380 });
      }
    }
    updatePos();
    window.addEventListener("scroll", updatePos);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos);
      window.removeEventListener("resize", updatePos);
    };
  }, [isOpen, anchorRef]);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  // Mark all notifications as read
  const markAllRead = async () => {
    if (!token) return;
    
    try {
      // Add explicit null check for TypeScript
      if (!token) return;
      
      const authenticatedFetch = createAuthenticatedFetch(token);
      const response = await authenticatedFetch(`${API_BASE_URL}notifications/mark_read`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
        );
        // Call the callback to update unread count in parent component
        onNotificationsRead?.();
      }
    } catch (e) {
      console.error("Failed to mark notifications as read", e);
    }
  };

  // Don't render on server or if document.body is not available
  if (!mounted || typeof window === "undefined" || !document.body || !isAuthenticated) {
    return null;
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popupRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            zIndex: 1000,
            width: 380,
          }}
          className="bg-[#18181B] border border-[#787880] rounded-2xl shadow-xl"
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#787880] rounded-t-2xl">
            <span className="text-white text-xl font-semibold">Сповіщення</span>
            <button 
              className="p-2 rounded-full hover:bg-[#23232A] transition" 
              aria-label="Налаштування"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="px-4 py-2">
            <button
              className="text-[#A1A1AA] text-sm font-medium hover:text-white transition"
              onClick={markAllRead}
            >
              Позначити всі як прочитані
            </button>
          </div>

          <div className="px-4 max-h-[240px] overflow-y-auto">
            {notifications.length === 0 && (
              <div className="text-[#A1A1AA] text-center py-8">Сповіщень немає</div>
            )}
            {notifications.map((n) => (
              <a
                key={n.id}
                href={n.data.url}
                className="block rounded-2xl px-4 py-3 mb-3 bg-transparent transition-colors hover:bg-[#23232A]"
                onClick={onClose}
              >
                <div className="text-white font-medium text-sm mb-1">
                  {n.data.message}
                </div>
                <div className="text-[#787880] text-xs">
                  {new Date(n.created_at).toLocaleString("uk-UA", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "short",
                  })}
                </div>
                {n.read_at === null && (
                  <span className="w-2 h-2 bg-[#4B7FCC] rounded-full mt-1 inline-block" />
                )}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default NotificationModal;
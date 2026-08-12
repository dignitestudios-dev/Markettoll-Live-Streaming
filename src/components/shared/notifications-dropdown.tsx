"use client";

import React, { useEffect, useRef } from "react";
import { FaCheck } from "react-icons/fa6";

interface NotificationItem {
  id?: string;
  title: string;
  body: string;
  createdAt: string;
}

interface NotificationsDropdownProps {
  openNotifications: boolean;
  notifications?: NotificationItem[];
  setOpenNotifications: (open: boolean) => void;
}

export default function NotificationsDropdown({
  openNotifications,
  notifications = [],
  setOpenNotifications,
}: NotificationsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenNotifications]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
      return new Intl.DateTimeFormat("en-US", options).format(date);
    } catch {
      return dateString || "";
    }
  };

  if (!openNotifications) return null;

  return (
    <div
      ref={dropdownRef}
      className="max-h-[332px] overflow-y-auto notification-dropdown p-4 bg-white z-50 w-[340px] shadow-lg rounded-lg absolute top-12 right-0 cursor-default border border-gray-100"
    >
      <h3 className="blue-text font-bold text-lg text-start mb-2">
        Notifications
      </h3>

      {notifications && notifications.length > 0 ? (
        <div className="flex flex-col gap-2">
          {notifications.map((notification, index) => (
            <div
              key={notification.id || index}
              className="w-full flex items-center justify-between border-b border-blue-400 py-3 text-left"
            >
              <div className="flex items-center gap-2 w-[85%]">
                <div className="border-[3px] border-blue-400 rounded-full p-1 w-8 h-8 flex items-center justify-center shrink-0">
                  <FaCheck className="w-full h-full light-blue-text" />
                </div>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-[15px] font-medium text-gray-800 truncate w-full">
                    {notification.title}
                  </span>
                  <span className="text-xs text-gray-500 truncate w-full">
                    {notification.body}
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                <span className="text-[10px] text-gray-400">
                  {formatDate(notification.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full text-center py-4">
          <p className="text-xs font-medium text-gray-500">No Notifications</p>
        </div>
      )}
    </div>
  );
}

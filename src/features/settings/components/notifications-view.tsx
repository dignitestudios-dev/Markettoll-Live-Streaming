"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/use-auth";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/auth.slice";
import {
  updatePushNotificationOptionsApi,
  PushNotificationOptions,
} from "../api/settings.service";
import Cookies from "js-cookie";

export default function NotificationsView() {
  const { user, accessToken } = useAuth();
  const dispatch = useAppDispatch();
  const userProfile = (user || {}) as any;

  const [notificationSettings, setNotificationSettings] =
    useState<PushNotificationOptions>({
      boostedProductsAndServices: false,
      wishlistItems: false,
      chatMessages: false,
      customerSupport: false,
    });

  useEffect(() => {
    if (userProfile?.pushNotificationOptions) {
      setNotificationSettings({
        boostedProductsAndServices:
          userProfile.pushNotificationOptions.boostedProductsAndServices ??
          false,
        wishlistItems:
          userProfile.pushNotificationOptions.wishlistItems ?? false,
        chatMessages:
          userProfile.pushNotificationOptions.chatMessages ?? false,
        customerSupport:
          userProfile.pushNotificationOptions.customerSupport ?? false,
      });
    }
  }, [userProfile]);

  const handleChange = async (settingKey: keyof PushNotificationOptions) => {
    const updatedSettings: PushNotificationOptions = {
      ...notificationSettings,
      [settingKey]: !notificationSettings[settingKey],
    };

    setNotificationSettings(updatedSettings);

    const token =
      accessToken ||
      Cookies.get("auth-token") ||
      (typeof window !== "undefined"
        ? localStorage.getItem("auth-token")
        : "") ||
      "";

    try {
      const res = await updatePushNotificationOptionsApi(
        updatedSettings,
        token
      );

      const updatedUser = {
        ...(user || {}),
        pushNotificationOptions:
          res?.data?.pushNotificationOptions || updatedSettings,
      };

      Cookies.set("user", JSON.stringify(updatedUser));
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("auth-user", JSON.stringify(updatedUser));
      }

      dispatch(
        setCredentials({ user: updatedUser as any, accessToken: token })
      );
    } catch (error: any) {
      console.error("Error updating notification setting:", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update notification setting";
      toast.error(msg);
      // Revert state on error
      setNotificationSettings(notificationSettings);
    }
  };

  return (
    <div className="px-0 md:px-5">
      <h2 className="blue-text text-[28px] font-bold">Notifications</h2>
      <div className="border-t border-gray-200 w-full mt-4" />

      {/* Product Alerts */}
      <div className="w-full flex items-center justify-between gap-4 shadow-sm border border-gray-100 p-5 rounded-2xl mt-5 bg-white">
        <div className="flex flex-col items-start gap-1">
          <span className="text-base font-semibold text-gray-900">
            Product Alerts
          </span>
          <span className="text-sm text-gray-600">
            Receive instant alerts on your device for newly listed products
            matching your interests.
          </span>
        </div>
        <div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.boostedProductsAndServices}
              onChange={() => handleChange("boostedProductsAndServices")}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
          </label>
        </div>
      </div>

      {/* Wishlist Updates */}
      <div className="w-full flex items-center justify-between gap-4 shadow-sm border border-gray-100 p-5 rounded-2xl mt-5 bg-white">
        <div className="flex flex-col items-start gap-1">
          <span className="text-base font-semibold text-gray-900">
            Wishlist Updates
          </span>
          <span className="text-sm text-gray-600">
            Receive alerts when a product on your wishlist becomes available or
            goes on sale
          </span>
        </div>
        <div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.wishlistItems}
              onChange={() => handleChange("wishlistItems")}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
          </label>
        </div>
      </div>

      {/* Seller Messages */}
      <div className="w-full flex items-center justify-between gap-4 shadow-sm border border-gray-100 p-5 rounded-2xl mt-5 bg-white">
        <div className="flex flex-col items-start gap-1">
          <span className="text-base font-semibold text-gray-900">
            Seller Messages
          </span>
          <span className="text-sm text-gray-600">
            Get instant alerts for inquiries, messages, and updates related to
            your listed products.
          </span>
        </div>
        <div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.chatMessages}
              onChange={() => handleChange("chatMessages")}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
          </label>
        </div>
      </div>

      {/* Customer Support */}
      <div className="w-full flex items-center justify-between gap-4 shadow-sm border border-gray-100 p-5 rounded-2xl mt-5 bg-white">
        <div className="flex flex-col items-start gap-1">
          <span className="text-base font-semibold text-gray-900">
            Customer Support
          </span>
          <span className="text-sm text-gray-600">
            Stay informed about the status of your orders, including
            confirmations, shipments, and deliveries.
          </span>
        </div>
        <div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.customerSupport}
              onChange={() => handleChange("customerSupport")}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

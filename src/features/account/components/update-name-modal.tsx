"use client";

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import ButtonLoader from "@/components/ui/button-loader";
import { updateNameApi } from "../api/account.service";
import { useAuth } from "@/hooks/use-auth";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/auth.slice";
import Cookies from "js-cookie";

interface UpdateNameModalProps {
  openNameModal: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UpdateNameModal({
  openNameModal,
  onClose,
  onSuccess,
}: UpdateNameModalProps) {
  const { user, accessToken } = useAuth();
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName((user as any)?.name || (user as any)?.firstName || "");
    }
  }, [user]);

  if (!openNameModal) return null;

  const handleUpdateName = async () => {
    if (!name.trim()) {
      toast.error("Please enter a valid name");
      return;
    }

    const token =
      accessToken ||
      Cookies.get("auth-token") ||
      (typeof window !== "undefined" ? localStorage.getItem("auth-token") : "") ||
      "";

    setLoading(true);
    try {
      const res = await updateNameApi(name, token);
      const updatedUser = { ...(user || {}), name: res?.data?.name || res?.data || name };

      Cookies.set("user", JSON.stringify(updatedUser));
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("auth-user", JSON.stringify(updatedUser));
      }

      dispatch(setCredentials({ user: updatedUser as any, accessToken: token }));
      onSuccess?.();
      onClose();
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to update name";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-[487px] bg-white rounded-[20px] p-6 relative flex flex-col items-center justify-center gap-4 shadow-xl border border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#F7F7F7] flex items-center justify-center absolute top-4 right-4 hover:bg-gray-200 transition cursor-pointer"
        >
          <IoClose className="w-5 h-5 text-gray-600" />
        </button>

        <div className="w-[85%] flex flex-col text-center gap-2 items-center justify-center pt-2">
          <p className="text-[#0098EA] text-[20px] font-bold">Update Name</p>
          <p className="leading-tight text-[#5C5C5C] text-[13px]">
            Please enter your new name below. This will help us update your
            profile accordingly.
          </p>
        </div>

        <div className="w-[90%] flex flex-col gap-2 items-start justify-center mt-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white p-3.5 outline-none border border-gray-200 focus:border-[#0098EA] rounded-[15px] w-full text-sm text-gray-800 transition"
            placeholder="John Smith"
          />
          <button
            className="w-full py-3 rounded-[15px] bg-[#0098EA] hover:bg-blue-600 active:scale-[0.99] text-white font-semibold mt-4 h-[50px] transition cursor-pointer flex items-center justify-center"
            type="button"
            onClick={handleUpdateName}
            disabled={loading}
          >
            {loading ? <ButtonLoader size={20} className="text-white" /> : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

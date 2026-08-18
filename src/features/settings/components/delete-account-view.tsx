"use client";

import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/use-auth";
import { useAppDispatch } from "@/store";
import { logout } from "@/store/slices/auth.slice";
import { unsubscribeStripeApi, deleteAccountApi } from "../api/settings.service";
import ButtonLoader from "@/components/ui/button-loader";
import Cookies from "js-cookie";

export default function DeleteAccountView() {
  const [showPass, setShowPass] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { accessToken } = useAuth();

  const handleDeleteAccount = async () => {
    if (!currentPass) {
      toast.error("Please enter your current password");
      return;
    }

    const token =
      accessToken ||
      Cookies.get("auth-token") ||
      (typeof window !== "undefined"
        ? localStorage.getItem("auth-token")
        : "") ||
      "";

    setLoading(true);
    try {
      let unsubscribed = false;
      try {
        const unsubscribeResponse = await unsubscribeStripeApi(token);
        if (unsubscribeResponse?.success || unsubscribeResponse?.status === 200) {
          unsubscribed = true;
        }
      } catch (err) {
        console.warn("Unsubscribe Stripe warning:", err);
        // Continue to account deletion attempt even if no stripe sub active
        unsubscribed = true;
      }

      if (unsubscribed) {
        const res = await deleteAccountApi(currentPass, token);
        if (res?.status === 200 || res?.data?.success) {
          setIsDeleted(true);
          Cookies.remove("market-signup");
          Cookies.remove("user");
          Cookies.remove("auth-token");
          if (typeof window !== "undefined") {
            localStorage.removeItem("user");
            localStorage.removeItem("market-signup");
            localStorage.removeItem("auth-user");
            localStorage.removeItem("auth-token");
          }
          dispatch(logout());
          setTimeout(() => {
            router.push("/auth/login");
          }, 1500);
        }
      } else {
        toast.error("Something went wrong while deleting your account.");
      }
    } catch (error: any) {
      console.error("error deleting account >>>", error?.response?.data);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete account";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-1 md:px-5">
      <h2 className="font-bold text-[28px] blue-text">Delete Account</h2>
      <div className="w-full border-t border-gray-200 mt-5 mb-4" />

      <div className="w-full max-w-xl">
        <p className="text-[13px] font-medium mb-1.5 text-gray-700">
          Current Password
        </p>
        <div className="w-full border border-gray-200 rounded-[20px] px-4 h-[50px] flex items-center justify-between bg-white focus-within:border-[#0098EA] transition">
          <div className="flex items-center justify-start gap-2 w-full">
            <img
              src="/password-icon.png"
              alt="lock-icon"
              className="w-[14px] h-[16px] object-contain opacity-70"
            />
            <input
              type={showPass ? "text" : "password"}
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="Current Password"
              className="h-[48px] px-2 text-sm text-[#5c5c5c] w-full bg-transparent outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="cursor-pointer"
          >
            {showPass ? (
              <FiEyeOff className="text-[#5c5c5c] text-base" />
            ) : (
              <FiEye className="text-[#5c5c5c] text-base" />
            )}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-4 max-w-xl leading-relaxed">
        Deleting your account will remove all of your information from database.
        This cannot be undone.
      </p>

      <div className="mt-4 max-w-xl">
        <p className="text-base font-semibold text-gray-900">Note</p>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          You cannot delete your account until all pending orders are fulfilled
          and any remaining balance is withdrawn.
        </p>
      </div>

      <div className="w-full max-w-xl mt-6">
        <button
          type="button"
          disabled={!currentPass || loading}
          onClick={handleDeleteAccount}
          className="bg-[#FF3B30] hover:bg-red-600 active:scale-[0.99] text-white py-3.5 rounded-[20px] w-full text-base font-bold transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <ButtonLoader size={20} className="text-white" />
          ) : (
            "Delete Account"
          )}
        </button>
      </div>

      <SuccessModal
        isDeleted={isDeleted}
        onclose={() => setIsDeleted(false)}
      />
    </div>
  );
}

const SuccessModal = ({
  isDeleted,
  onclose,
}: {
  isDeleted: boolean;
  onclose: () => void;
}) => {
  if (!isDeleted) return null;

  return (
    <div className="w-full h-screen fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center px-4">
      <div className="bg-white flex flex-col items-center justify-center gap-3 relative w-full max-w-[440px] h-[212px] rounded-[20px] p-6 shadow-2xl border border-gray-100 text-center">
        <button
          type="button"
          onClick={onclose}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 p-1.5 absolute top-5 right-5 flex items-center justify-center transition cursor-pointer"
        >
          <IoClose className="w-full h-full text-gray-600" />
        </button>

        <div className="w-[60px] h-[60px] blue-bg rounded-full p-4 flex items-center justify-center">
          <FaCheck className="w-full h-full text-white" />
        </div>
        <p className="text-lg font-bold blue-text">Account Deleted</p>
        <p className="text-[#5c5c5c] text-sm font-medium">
          Your account has been deleted successfully
        </p>
      </div>
    </div>
  );
};

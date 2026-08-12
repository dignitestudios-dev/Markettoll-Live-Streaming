"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import ButtonLoader from "@/components/ui/button-loader";
import { updateProfileImageApi } from "../api/account.service";
import { useAuth } from "@/hooks/use-auth";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/auth.slice";
import Cookies from "js-cookie";

interface UpdateProfileImageModalProps {
  openProfileImageModal: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UpdateProfileImageModal({
  openProfileImageModal,
  onClose,
  onSuccess,
}: UpdateProfileImageModalProps) {
  const { user, accessToken } = useAuth();
  const dispatch = useAppDispatch();
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!openProfileImageModal) return null;

  const handleUpdateProfileImage = async () => {
    if (!image) {
      toast.error("Please select an image first");
      return;
    }

    const token =
      accessToken ||
      Cookies.get("auth-token") ||
      (typeof window !== "undefined" ? localStorage.getItem("auth-token") : "") ||
      "";

    setLoading(true);
    const formData = new FormData();
    formData.append("profileImage", image);

    try {
      const res = await updateProfileImageApi(formData, token);
      const newImageUrl =
        res?.data?.profileImage ||
        res?.profileImage ||
        URL.createObjectURL(image);

      const updatedUser = { ...(user || {}), profileImage: newImageUrl };

      Cookies.set("user", JSON.stringify(updatedUser));
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("auth-user", JSON.stringify(updatedUser));
      }

      dispatch(setCredentials({ user: updatedUser as any, accessToken: token }));
      onSuccess?.();
      onClose();
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to update profile image";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const currentImage = (user as any)?.profileImage || (user as any)?.image;

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
          <p className="text-[#0098EA] text-[20px] font-bold">
            Update Profile Image
          </p>
        </div>

        <div className="flex items-center justify-center w-full my-3">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-[140px] h-[140px] border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100 transition overflow-hidden relative group"
          >
            <div className="flex flex-col items-center justify-center w-full h-full rounded-full">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : currentImage ? (
                <img
                  src={currentImage}
                  alt="profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <img
                  src="/upload-profile-image-icon.png"
                  alt="upload"
                  className="h-[40px] w-[43px] object-contain opacity-80"
                />
              )}
            </div>
            <input
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              id="dropzone-file"
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>

        <div className="w-[90%] flex flex-col gap-1 items-center justify-center">
          <button
            className="w-full py-3 rounded-[15px] bg-[#0098EA] hover:bg-blue-600 active:scale-[0.99] text-white font-semibold h-[50px] transition cursor-pointer flex items-center justify-center"
            type="button"
            onClick={handleUpdateProfileImage}
            disabled={loading}
          >
            {loading ? <ButtonLoader size={20} className="text-white" /> : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

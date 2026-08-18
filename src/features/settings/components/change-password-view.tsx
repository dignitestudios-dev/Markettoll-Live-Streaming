"use client";

import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/use-auth";
import { changePasswordApi } from "../api/settings.service";
import Cookies from "js-cookie";

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

const validate = (values: FormValues): FormErrors => {
  const errors: FormErrors = {};

  if (!values.currentPassword) {
    errors.currentPassword = "Required";
  }

  if (!values.newPassword) {
    errors.newPassword = "Required";
  } else if (values.newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters";
  } else if (!/(?=.*[a-z])/.test(values.newPassword)) {
    errors.newPassword = "Password must contain at least one lowercase letter";
  } else if (!/(?=.*[A-Z])/.test(values.newPassword)) {
    errors.newPassword = "Password must contain at least one uppercase letter";
  } else if (!/(?=.*[0-9])/.test(values.newPassword)) {
    errors.newPassword = "Password must contain at least one number";
  } else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(values.newPassword)) {
    errors.newPassword = "Password must contain at least one special character";
  }

  if (!values.confirmNewPassword) {
    errors.confirmNewPassword = "Required";
  } else if (values.confirmNewPassword !== values.newPassword) {
    errors.confirmNewPassword = "Passwords do not match";
  }

  return errors;
};

export default function ChangePasswordView() {
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState<FormValues>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    if (touched[name]) {
      setErrors(validate(newValues));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      currentPassword: true,
      newPassword: true,
      confirmNewPassword: true,
    });

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
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
      const res = await changePasswordApi(
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        token
      );

      if (res?.status === 200 || res?.data?.success) {
        setValues({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setTouched({});
        setErrors({});
        handleToggleModal();
      }
    } catch (error: any) {
      console.error("change password error >>>", error?.response?.data);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to change password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-1 md:px-5">
      <h2 className="font-bold text-[28px] blue-text">Change Password</h2>
      <div className="w-full border-t border-gray-200 mt-5 mb-4" />

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-start gap-5 max-w-2xl"
      >
        {/* Current Password */}
        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="currentPassword" className="text-[13px] font-medium text-gray-700">
            Current Password
          </label>
          <div className="w-full border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 bg-white focus-within:border-[#0098EA] transition">
            <img
              src="/password-icon.png"
              alt="lock-icon"
              className="w-[14px] h-[16px] object-contain opacity-70"
            />
            <input
              type={showCurrentPass ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.currentPassword}
              className="w-full border-none outline-none text-sm text-[#5c5c5c] bg-transparent"
              placeholder="Current Password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPass(!showCurrentPass)}
              className="cursor-pointer"
            >
              {showCurrentPass ? (
                <FiEye className="text-base text-[#5c5c5c]" />
              ) : (
                <FiEyeOff className="text-base text-[#5c5c5c]" />
              )}
            </button>
          </div>
          {touched.currentPassword && errors.currentPassword ? (
            <div className="text-xs text-red-500 font-medium pl-2">
              {errors.currentPassword}
            </div>
          ) : null}
        </div>

        {/* New Password */}
        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="newPassword" className="text-[13px] font-medium text-gray-700">
            New Password
          </label>
          <div className="w-full border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 bg-white focus-within:border-[#0098EA] transition">
            <img
              src="/password-icon.png"
              alt="lock-icon"
              className="w-[14px] h-[16px] object-contain opacity-70"
            />
            <input
              type={showNewPass ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.newPassword}
              className="w-full border-none outline-none text-sm text-[#5c5c5c] bg-transparent"
              placeholder="New Password"
            />
            <button
              type="button"
              onClick={() => setShowNewPass(!showNewPass)}
              className="cursor-pointer"
            >
              {showNewPass ? (
                <FiEye className="text-base text-[#5c5c5c]" />
              ) : (
                <FiEyeOff className="text-base text-[#5c5c5c]" />
              )}
            </button>
          </div>
          {touched.newPassword && errors.newPassword ? (
            <div className="text-xs text-red-500 font-medium pl-2">
              {errors.newPassword}
            </div>
          ) : null}
        </div>

        {/* Confirm New Password */}
        <div className="w-full flex flex-col items-start gap-1">
          <label
            htmlFor="confirmNewPassword"
            className="text-[13px] font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="w-full border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 bg-white focus-within:border-[#0098EA] transition">
            <img
              src="/password-icon.png"
              alt="lock-icon"
              className="w-[14px] h-[16px] object-contain opacity-70"
            />
            <input
              type={showConfirmPass ? "text" : "password"}
              id="confirmNewPassword"
              name="confirmNewPassword"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.confirmNewPassword}
              className="w-full border-none outline-none text-sm text-[#5c5c5c] bg-transparent"
              placeholder="Confirm Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="cursor-pointer"
            >
              {showConfirmPass ? (
                <FiEye className="text-base text-[#5c5c5c]" />
              ) : (
                <FiEyeOff className="text-base text-[#5c5c5c]" />
              )}
            </button>
          </div>
          {touched.confirmNewPassword && errors.confirmNewPassword ? (
            <div className="text-xs text-red-500 font-medium pl-2">
              {errors.confirmNewPassword}
            </div>
          ) : null}
        </div>

        <div className="w-full pt-2">
          <button
            type="submit"
            disabled={loading}
            className="blue-bg hover:bg-blue-600 active:scale-[0.99] text-white font-bold text-base w-full py-3.5 rounded-2xl transition cursor-pointer flex items-center justify-center"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      <DeleteSuccessModal showModal={showModal} onclose={handleToggleModal} />
    </div>
  );
}

const DeleteSuccessModal = ({
  showModal,
  onclose,
}: {
  showModal: boolean;
  onclose: () => void;
}) => {
  if (!showModal) return null;

  return (
    <div className="w-full h-screen fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
      <div className="bg-white w-full lg:w-[440px] h-[209px] p-7 relative rounded-[20px] flex flex-col items-center justify-center gap-2 shadow-2xl border border-gray-100">
        <button
          type="button"
          onClick={onclose}
          className="bg-gray-200 hover:bg-gray-300 w-6 h-6 rounded-full p-1 absolute top-5 right-5 flex items-center justify-center transition cursor-pointer"
        >
          <IoClose className="w-full h-full text-gray-700" />
        </button>
        <div className="rounded-full blue-bg h-[69px] w-[69px] p-4 flex items-center justify-center">
          <FaCheck className="text-white w-full h-full" />
        </div>
        <span className="text-lg blue-text font-bold">Password Changed</span>
        <span className="text-[#000000] text-sm font-medium">
          Password changed successfully
        </span>
      </div>
    </div>
  );
};

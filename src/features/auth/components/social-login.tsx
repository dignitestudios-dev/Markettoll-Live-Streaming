"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FaFacebookF } from "react-icons/fa";
import { signInWithPopup, FacebookAuthProvider, OAuthProvider } from "firebase/auth";
import axiosInstance from "@/lib/axios";
import { auth, googleProvider, appleProvider } from "@/firebase/firebase";
import { BASE_URL } from "@/api/api";
import { toast } from "react-toastify";
import ButtonLoader from "@/components/ui/button-loader";

export default function SocialLogin() {
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setErrorMsg("");
      const result = await signInWithPopup(auth, googleProvider);
      if (result?.user) {
        const token = await result.user.getIdToken();
        if (token) {
          const res = await axiosInstance.post(`${BASE_URL}/users/google-login`, {
            name: result.user.displayName,
            email: result.user.email,
            googleAuthId: result.user.uid,
            profileImage: result.user.photoURL,
          });

          if (res.status === 200 || res.data?.success) {
            const userData = res.data?.data || res.data;
            Cookies.set("user", JSON.stringify(userData));
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("auth-user", JSON.stringify(userData));
            if (userData?.token) {
              Cookies.set("auth-token", userData.token);
              localStorage.setItem("auth-token", userData.token);
            }
            router.push("/add-phone-number");
          }
        }
      }
    } catch (err: any) {
      console.error("Google Login Error:", err);
      const msg = err.response?.data?.message || err.message || "Google sign-in failed";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setAppleLoading(true);
      setErrorMsg("");
      const result = await signInWithPopup(auth, appleProvider);
      if (result?.user) {
        const token = await result.user.getIdToken();
        if (token) {
          let ip = "";
          try {
            const ipRes = await fetch("https://api.ipify.org?format=json");
            const ipData = await ipRes.json();
            ip = ipData?.ip || "";
          } catch {
            // ignore IP fetch error
          }

          const response = await axiosInstance.post(`${BASE_URL}/users/apple-login`, {
            email: result.user.email,
            name: result.user.displayName,
            appleAuthId: result.user.uid,
            profileImage: result.user.photoURL || "",
            idToken: token,
            ip,
          });

          if (response.data?.success) {
            const userData = response.data?.data;
            Cookies.set("user", JSON.stringify(userData));
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("auth-user", JSON.stringify(userData));
            if (response.data?.token) {
              Cookies.set("auth-token", response.data.token);
              localStorage.setItem("auth-token", response.data.token);
            }
            router.push("/add-phone-number");
          }
        }
      }
    } catch (err: any) {
      console.error("Apple Login Error:", err);
      const msg = err.response?.data?.message || err.message || "Apple sign-in failed";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setAppleLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setFacebookLoading(true);
      setErrorMsg("");
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result?.user) {
        const token = await result.user.getIdToken();
        if (token) {
          let ip = "";
          try {
            const ipRes = await fetch("https://api.ipify.org?format=json");
            const ipData = await ipRes.json();
            ip = ipData?.ip || "";
          } catch {
            // ignore IP fetch error
          }

          const response = await axiosInstance.post(`${BASE_URL}/users/facebook-login`, {
            email: result.user.email,
            name: result.user.displayName,
            facebookAuthId: result.user.uid,
            profileImage: result.user.photoURL,
            idToken: token,
            ip,
          });

          if (response.data?.success) {
            const userData = response.data?.data;
            Cookies.set("user", JSON.stringify(userData));
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("auth-user", JSON.stringify(userData));
            router.push("/add-phone-number");
          }
        }
      }
    } catch (err: any) {
      console.error("Facebook Login Error:", err);
      const msg = err.response?.data?.message || err.message || "Facebook sign-in failed";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setFacebookLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
   
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          aria-label="Sign in with Google"
          className="flex cursor-pointer items-center justify-center w-full h-12 bg-[#FFFFFF80] border hover:bg-white border-gray-200 rounded-full p-1 transition-all"
        >
          {googleLoading ? (
            <ButtonLoader size={18} className="text-[#EA4335]" />
          ) : (
            <div className="flex items-center justify-center w-9 h-9">
              <img src="/google-icon.png" className="w-[22px] h-[22px]" alt="Google" />
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={handleAppleLogin}
          aria-label="Sign in with Apple"
          className="flex  cursor-pointer items-center justify-center w-full h-12 bg-[#FFFFFF80] border hover:bg-white border-gray-200 rounded-full p-1 transition-all"
        >
          {appleLoading ? (
            <ButtonLoader size={18} className="text-black" />
          ) : (
            <div className="flex items-center text-gray-800 justify-center bg-[#FFFFFF80] w-9 h-9 rounded-full">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 384 512"
                className="text-xl"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
              </svg>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={handleFacebookLogin}
          aria-label="Sign in with Facebook"
          className="flex cursor-pointer items-center justify-center w-full h-12 bg-[#FFFFFF80] border hover:bg-white border-gray-200 rounded-full p-1 transition-all"
        >
          {facebookLoading ? (
            <ButtonLoader size={18} className="text-[#1877F2]" />
          ) : (
            <div className="flex items-center justify-center bg-[#FFFFFF80] w-9 h-9 rounded-full">
              <FaFacebookF className="text-xl text-[#1877F2]" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

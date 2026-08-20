"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";

interface SidebarProps {
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
  handleLogout: () => void;
  user?: any;
}

export default function Sidebar({
  openSidebar,
  setOpenSidebar,
  handleLogout,
  user,
}: SidebarProps) {
  const [openSidebarDropdown, setOpenSidebarDropdown] = useState(false);
  const router = useRouter();

  const handleToggleMenu = () => {
    setOpenSidebarDropdown(!openSidebarDropdown);
  };

  const toggleSidebarAndNavigate = (url: string) => {
    router.push(url);
    setOpenSidebar(false);
  };

  return (
    <div className="w-4/5 sm:w-2/3 bg-white h-full shadow-2xl p-5 relative overflow-y-auto">
      <button
        onClick={() => setOpenSidebar(false)}
        className="absolute top-5 right-4 bg-white shadow-md w-8 h-8 blue-bg rounded-xl flex items-center justify-center cursor-pointer"
        aria-label="Close menu"
      >
        <IoClose className="text-2xl text-white" />
      </button>

      <Link href="/" onClick={() => setOpenSidebar(false)}>
        <img src="/logo-white.png" alt="logo" className="w-[85px] h-[85px] object-contain bg-[#0098EA] p-2 rounded-xl" />
      </Link>

      <div className="w-full mt-5 px-1">
        <ul className="flex flex-col items-start gap-3 text-gray-800">
          {user?.role !== "influencer" ? (
            <>
              <li className="text-[15px] font-medium py-0.5 w-full text-left">
                <button
                  type="button"
                  onClick={() => toggleSidebarAndNavigate("/create-live-stream")}
                  className="w-full text-left font-semibold text-[#0098EA]"
                >
                  Create Live Stream
                </button>
              </li>
              <li className="text-[15px] font-medium py-0.5 w-full text-left">
                <button
                  type="button"
                  onClick={() => toggleSidebarAndNavigate("/account/peronal-info")}
                  className="w-full text-left"
                >
                  Personal Information
                </button>
              </li>
              
              <li className="w-full">
                <button
                  type="button"
                  onClick={handleToggleMenu}
                  className="text-[15px] font-medium py-0.5 w-full flex items-center justify-between"
                >
                  <span>Settings</span>
                  <IoIosArrowDown
                    className={`text-sm ${
                      openSidebarDropdown ? "rotate-180" : "rotate-0"
                    } transition-transform duration-300`}
                  />
                </button>
                {openSidebarDropdown && (
                  <div className="py-1 pl-4 flex flex-col items-start gap-2 border-l border-gray-200 mt-1">
                    <button
                      type="button"
                      onClick={() => toggleSidebarAndNavigate("/settings")}
                      className="text-[13px] font-medium text-gray-600 hover:text-[#0098EA]"
                    >
                      Notifications
                    </button>
                 
                    <button
                      type="button"
                      onClick={() => toggleSidebarAndNavigate("/settings/change-password")}
                      className="text-[13px] font-medium text-gray-600 hover:text-[#0098EA]"
                    >
                      Change Password
                    </button>
                   
                    <button
                      type="button"
                      onClick={() => toggleSidebarAndNavigate("/terms-and-conditions")}
                      className="text-[13px] font-medium text-gray-600 hover:text-[#0098EA]"
                    >
                      Terms & Conditions
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSidebarAndNavigate("/privacy-policy")}
                      className="text-[13px] font-medium text-gray-600 hover:text-[#0098EA]"
                    >
                      Privacy Policy
                    </button>
                  
                    <button
                      type="button"
                      onClick={() => toggleSidebarAndNavigate("/settings/delete-account")}
                      className="text-[13px] font-medium text-gray-600 hover:text-[#0098EA]"
                    >
                      Delete Account
                    </button>
                  </div>
                )}
              </li>
              <li className="text-[15px] font-medium py-0.5 w-full text-left">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-red-500 font-semibold"
                >
                  Log out
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="text-[15px] font-medium py-0.5 w-full text-left">
                <button
                  type="button"
                  onClick={() => toggleSidebarAndNavigate("/account/peronal-info")}
                  className="w-full text-left"
                >
                  Personal Information
                </button>
              </li>
              <li className="text-[15px] font-medium py-0.5 w-full text-left">
                <button
                  type="button"
                  onClick={() => toggleSidebarAndNavigate("/account/my-wallet")}
                  className="w-full text-left"
                >
                  My Wallet
                </button>
              </li>
              <li className="text-[15px] font-medium py-0.5 w-full text-left">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-red-500 font-semibold"
                >
                  Log out
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { TbMenu2 } from "react-icons/tb";
import { useAuth } from "@/hooks/use-auth";
import { useAppDispatch } from "@/store";
import { logout } from "@/store/slices/auth.slice";
import NotificationsDropdown from "./notifications-dropdown";
import Sidebar from "./sidebar";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const shouldHideSearch =
    pathname === "/auth/login" ||
    pathname === "/login" ||
    pathname === "/sign-up" ||
    pathname === "/auth/register";

  const shouldHideNavbar =
    pathname === "/pre-stream-setup" ||
    pathname === "/pre-live-setup" ||
    pathname?.startsWith("/live-stream");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (!searchHistory.includes(searchQuery.trim())) {
        setSearchHistory((prev) => [searchQuery.trim(), ...prev]);
      }
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsDropdownVisible(false);
    }
  };

  const handleSearchHistoryClick = (item: string) => {
    setSearchQuery(item);
    router.push(`/search?q=${encodeURIComponent(item)}`);
    setIsDropdownVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
    localStorage.removeItem("user");
    Cookies.remove("user");
    Cookies.remove("auth-token");
    document.cookie = "auth-token=; path=/; max-age=0";
    dispatch(logout());
    setShowProfileDropdown(false);
    setOpenSidebar(false);
    router.push("/auth/login");
  };

  const handleNavigate = (path: string, alertMsg?: string) => {
    if (!user && alertMsg) {
      router.push("/auth/login");
      return;
    }
    router.push(path);
  };

  const handleOpenNotifications = () => {
    setOpenNotifications((prev) => !prev);
  };

  const userProfile = (user || {}) as any;

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <nav className="padding-x w-full py-5 flex items-center justify-between blue-bg sticky top-0 z-50 shadow-md">
      {/* Logo */}
      <Link href="/">
        <img
          src="/logo-white.png"
          alt="logo"
          className="w-[74px] h-[57px] object-contain hover:opacity-90 transition-opacity"
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center justify-end gap-3">
        {!shouldHideSearch && (
          <div className="relative">
            <form
              onSubmit={handleSearchProduct}
              className="h-[42px] w-[357px] flex items-center justify-between gap-2 px-3 rounded-[15px] bg-[#38adebe7] border-none"
            >
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsDropdownVisible(true)}
                onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
                className="outline-none bg-transparent w-full h-full text-sm text-white placeholder:text-white/80"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    router.push("/");
                  }}
                  className="cursor-pointer"
                >
                  <IoClose className="text-white text-xl" />
                </button>
              ) : (
                <button type="submit" className="cursor-pointer">
                  <IoSearchOutline className="text-white text-2xl" />
                </button>
              )}
            </form>

            {isDropdownVisible && searchHistory.length > 0 && (
              <div className="absolute top-[45px] w-[357px] left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg mt-1 z-10">
                <ul className="max-h-[200px] overflow-y-auto py-2 px-5 text-gray-800">
                  {searchHistory
                    .filter((item) =>
                      item.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((historyItem, index) => (
                      <li
                        key={index}
                        className={`py-2 cursor-pointer flex items-center justify-between text-[16px] ${
                          index !== 0 ? "border-t border-gray-100" : ""
                        }`}
                        onClick={() => handleSearchHistoryClick(historyItem)}
                      >
                        <span>{historyItem}</span>
                        <MdOutlineKeyboardArrowRight className="blue-text text-xl" />
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {user && pathname !== "/auth/login" && pathname !== "/login" ? (
          <div className="hidden lg:flex items-center justify-end gap-3 relative">
            {user?.role !== "influencer" && (
              <>
               

                {/* <button
                  type="button"
                  onClick={handleOpenNotifications}
                  className="w-[32px] h-[32px] rounded-[10px] bg-white flex items-center justify-center relative cursor-pointer hover:bg-gray-50 transition-colors"
                  title="Notifications"
                >
                  <img
                    src="/notifications-icon-blue.png"
                    alt="notifications-icon"
                    className="w-[18px] h-[18px]"
                  />
                  <NotificationsDropdown
                    openNotifications={openNotifications}
                    notifications={notifications}
                    setOpenNotifications={setOpenNotifications}
                  />
                </button> */}

             

                <a
                  href="https://form.jotform.com/officeugeai/markettoll-concept-challenge-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white light-blue-text px-4 py-1.5 rounded-[10px] font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Markettoll Vision
                </a>
              </>
            )}

            {/* Profile trigger */}
            <button
              type="button"
              onClick={() => setShowProfileDropdown((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={
                  userProfile?.profileImage ||
                  userProfile?.image ||
                  "/upload-profile-image-icon.png"
                }
                alt="profile-image"
                className="w-[32px] h-[32px] rounded-full object-cover border border-white/50"
              />
              <span className="text-base font-medium text-white max-w-[120px] truncate">
                {userProfile?.name || userProfile?.firstName || userProfile?.email || "Account"}
              </span>
              <IoIosArrowDown className="text-white text-sm" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <a
              href="https://form.jotform.com/officeugeai/markettoll-concept-challenge-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white light-blue-text px-4 py-1.5 rounded-[10px] font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Markettoll Vision
            </a>

            {pathname !== "/auth/login" && pathname !== "/login" && (
              <Link
                href="/auth/login"
                className="bg-white px-4 py-1.5 rounded-[10px] light-blue-text font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        )}

        {/* Profile Dropdown Menu */}
        {showProfileDropdown && (
          <div
            ref={dropdownRef}
            className="w-[220px] p-5 bg-white z-50 shadow-2xl rounded-[20px] absolute top-16 right-[12px] border border-gray-100/80 text-gray-800 animate-in fade-in zoom-in-95 duration-150"
          >
            <ul className="flex flex-col items-start gap-3.5 text-gray-800 text-[15px] font-medium">
              <li className="w-full hover:text-[#0098EA] transition-colors">
                <Link
                  href="/account/peronal-info"
                  onClick={() => setShowProfileDropdown(false)}
                  className="block w-full"
                >
                  Personal Information
                </Link>
              </li>

          

             

              <li className="w-full hover:text-[#0098EA] transition-colors">
                <Link
                  href="/settings"
                  onClick={() => setShowProfileDropdown(false)}
                  className="block w-full"
                >
                  Settings
                </Link>
              </li>

             

              <li className="w-full pt-1 border-t border-gray-100/80">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[#FF4D4D] font-medium w-full text-left cursor-pointer hover:opacity-80 transition-opacity"
                >
                  Log out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center justify-end gap-3">
        {user?.role !== "influencer" && pathname !== "/auth/login" && pathname !== "/login" && (
          <>
            {/* <Link
              href="/chats"
              className="w-[28px] h-[28px] bg-white rounded-[10px] flex items-center justify-center"
            >
              <img
                src="/message-icon-blue.png"
                alt="messages-icon"
                className="w-[15px] h-[15px]"
              />
            </Link>

            <button
              type="button"
              onClick={() => handleNavigate("/favourites", "Login to see favourites")}
              className="w-[28px] h-[28px] rounded-[10px] bg-white flex items-center justify-center cursor-pointer"
            >
              <img
                src="/heart-icon-blue.png"
                alt="heart-icon"
                className="w-[18px] h-[18px]"
              />
            </button>

            <Link
              href="/cart"
              className="w-[28px] h-[28px] rounded-[10px] bg-white flex items-center justify-center"
            >
              <img
                src="/cart-icon-blue.png"
                alt="cart-icon"
                className="w-[15px] h-[15px]"
              />
            </Link> */}
{/* 
            <button
              type="button"
              onClick={handleOpenNotifications}
              className="w-[28px] h-[28px] rounded-[10px] bg-white flex items-center justify-center relative cursor-pointer"
            >
              <img
                src="/notifications-icon-blue.png"
                alt="notifications-icon"
                className="w-[15px] h-[15px]"
              />
              <NotificationsDropdown
                openNotifications={openNotifications}
                notifications={notifications}
                setOpenNotifications={setOpenNotifications}
              />
            </button> */}
          </>
        )}

        {user && pathname !== "/auth/login" && pathname !== "/login" ? (
          <button
            type="button"
            onClick={() => setOpenSidebar(!openSidebar)}
            className="cursor-pointer p-1 text-white"
            aria-label="Toggle Menu"
          >
            <TbMenu2 className="text-2xl text-white" />
          </button>
        ) : (
          <>
            {pathname !== "/auth/login" && pathname !== "/login" && (
              <Link
                href="/auth/login"
                className="bg-white px-4 py-1.5 rounded-[10px] light-blue-text font-semibold text-sm"
              >
                Login
              </Link>
            )}
          </>
        )}
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`w-full h-screen fixed inset-0 z-50 ${
          openSidebar ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out bg-black/50`}
      >
        <Sidebar
          user={user}
          handleLogout={handleLogout}
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
        />
      </div>
    </nav>
  );
}

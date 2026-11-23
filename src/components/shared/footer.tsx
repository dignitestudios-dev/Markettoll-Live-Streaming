
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter, FaInstagram } from "react-icons/fa6";
import { IoCallOutline, IoMailOutline } from "react-icons/io5";

interface FooterProps {
  variant?: "blue" | "white";
}

export default function Footer({ variant = "blue" }: FooterProps) {
  const pathname = usePathname();

  if (pathname?.startsWith("/live-stream")) {
    return null;
  }

  return (
    <footer
      className={`w-full py-8 sm:py-10 px-4 sm:px-8 lg:px-12 transition-colors blue-bg text-white mt-12 padding-x`}
    >
      <div className="w-full max-w-[1240px] mx-auto flex flex-col gap-6 select-none">

        {/* Main Footer Row */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

          {/* Left: Footer Links */}
          <div className="flex items-center justify-center md:justify-start gap-4">
            <Link
              href="https://www.markettoll.com/terms-and-conditions"
              className="text-white underline text-sm"
              target="_blank"
            >
              Terms & Conditions
            </Link>

            <Link
              href="https://www.markettoll.com/privacy-policy"
              className="text-white underline text-sm"
              target="_blank"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Center: Logo, Email & Phone */}
          <div className="flex flex-col items-center justify-center gap-3">
            <img
              src="/logo-white.png"
              alt="Markettoll Logo"
              className="h-10 sm:h-12 w-auto object-contain"
            />

            <div className="flex items-center justify-center gap-2">
              <IoMailOutline className="w-5 h-5 text-white" />
              <a
                href="mailto:info@markettoll.com"
                className="font-medium text-sm sm:text-base hover:underline text-white"
              >
                info@markettoll.com
              </a>
            </div>

            <div className="flex items-center justify-center gap-2">
              <IoCallOutline className="w-5 h-5 text-white" />
              <a
                href="tel:8337702446"
                className="font-medium text-sm sm:text-base hover:underline text-white"
              >
                833-770-2446
              </a>
            </div>
          </div>

          {/* Right: Social Icons */}
          <div className="flex items-center justify-center md:justify-end gap-4 sm:gap-5">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.facebook.com"
              aria-label="Facebook"
            >
              <FaFacebook className="w-5 h-5 sm:w-6 sm:h-6 hover:opacity-80 transition-opacity text-white" />
            </a>

            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.twitter.com"
              aria-label="Twitter"
            >
              <FaXTwitter className="w-5 h-5 sm:w-6 sm:h-6 hover:opacity-80 transition-opacity text-white" />
            </a>

            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com"
              aria-label="Instagram"
            >
              <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6 hover:opacity-80 transition-opacity text-white" />
            </a>

            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5 sm:w-6 sm:h-6 hover:opacity-80 transition-opacity text-white" />
            </a>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="text-center pt-4 border-t border-white/20 mt-4">
          <p className="text-xs sm:text-sm font-normal opacity-90 text-white">
            Copyright © 2026 All rights reserved
          </p>


        </div>

      </div>
    </footer>
  );
}

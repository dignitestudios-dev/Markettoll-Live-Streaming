"use client";

import React, { useRef, useState } from "react";
import { LuCamera, LuX, LuUpload } from "react-icons/lu";
import { toast } from "react-toastify";

interface ThumbnailUploaderProps {
  value: File | string | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export default function ThumbnailUploader({
  value,
  onChange,
  error,
}: ThumbnailUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const previewUrl =
    typeof value === "string"
      ? value
      : value instanceof File
      ? URL.createObjectURL(value)
      : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be 5MB or less");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      onChange(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image size must be 5MB or less");
          return;
        }
        onChange(file);
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-800">Thumbnail</label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative w-full h-[170px] sm:h-[190px] rounded-2xl border transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
          previewUrl
            ? "border-gray-200 bg-gray-50"
            : dragActive
            ? "border-[#003DAC] bg-blue-50/50"
            : error
            ? "border-red-400 bg-red-50/20"
            : "border-gray-200 hover:border-gray-300 bg-white"
        }`}
      >
        {previewUrl ? (
          <div className="relative w-full h-full group">
            <img
              src={previewUrl}
              alt="Thumbnail preview"
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <span className="text-xs font-semibold text-white bg-black/60 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <LuUpload className="text-base" /> Change Thumbnail
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-transform hover:scale-105"
                title="Remove thumbnail"
              >
                <LuX className="text-base" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center mb-2.5 text-gray-500">
              <LuCamera className="text-2xl text-gray-500" />
            </div>

            <p className="text-sm font-semibold text-gray-800 mb-0.5">
              Tap to upload thumbnail
            </p>
            <p className="text-xs text-gray-400 font-normal">
              Recommended size: 16:9 / 1080p
            </p>
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs font-medium text-red-500 mt-1">
          {error}
        </span>
      )}
    </div>
  );
}

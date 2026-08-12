"use client";

import React from "react";
import { UseFormRegister, FieldErrors, UseFormWatch, Control, Controller } from "react-hook-form";
import { CreateLiveStreamSchemaType } from "../schemas/create-live-stream.schema";
import ThumbnailUploader from "./thumbnail-uploader";
import CategoryCustomDropdown from "./category-custom-dropdown";
import { IoIosArrowDown } from "react-icons/io";

interface StreamInfoFormProps {
  register: UseFormRegister<CreateLiveStreamSchemaType>;
  errors: FieldErrors<CreateLiveStreamSchemaType>;
  watch: UseFormWatch<CreateLiveStreamSchemaType>;
  control: Control<CreateLiveStreamSchemaType>;
}

export default function StreamInfoForm({
  register,
  errors,
  watch,
  control,
}: StreamInfoFormProps) {
  const titleValue = watch("title") || "";
  const descriptionValue = watch("description") || "";

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Live Title */}
      <div className="w-full flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-800">Live Title</label>
          <span className={`text-xs font-medium ${titleValue.length > 100 ? "text-red-500" : "text-gray-400"}`}>
            {titleValue.length}/100
          </span>
        </div>
        <input
          type="text"
          placeholder="e.g. Summer Flash Sale - Xbox Special"
          maxLength={100}
          {...register("title")}
          className={`w-full h-[52px] px-4 rounded-[16px] bg-white border text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all ${
            errors.title
              ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400"
              : "border-gray-200/90 focus:border-[#003DAC] focus:ring-1 focus:ring-[#003DAC]"
          }`}
        />
        {errors.title && (
          <span className="text-xs font-medium text-red-500">{errors.title.message}</span>
        )}
      </div>

      {/* Description */}
      <div className="w-full flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-800">Description</label>
          <span className={`text-xs font-medium ${descriptionValue.length > 500 ? "text-red-500" : "text-gray-400"}`}>
            {descriptionValue.length}/500
          </span>
        </div>
        <textarea
          rows={4}
          placeholder="Xbox Series X is Microsoft's flagship gaming console, offering unparalleled performance and speed. With its powerful 12TFLOPS GPU processor..."
          maxLength={500}
          {...register("description")}
          className={`w-full p-4 rounded-[16px] bg-white border text-sm text-gray-800 placeholder:text-gray-400 outline-none resize-none transition-all leading-relaxed ${
            errors.description
              ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400"
              : "border-gray-200/90 focus:border-[#003DAC] focus:ring-1 focus:ring-[#003DAC]"
          }`}
        />
        {errors.description && (
          <span className="text-xs font-medium text-red-500">{errors.description.message}</span>
        )}
      </div>

      {/* Category */}
      <div className="w-full flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-800">Category</label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <CategoryCustomDropdown
              value={field.value || ""}
              onChange={(val) => field.onChange(val)}
              error={errors.category?.message}
            />
          )}
        />
        {errors.category && (
          <span className="text-xs font-medium text-red-500">{errors.category.message}</span>
        )}
      </div>

      {/* Thumbnail Upload */}
      <Controller
        name="thumbnail"
        control={control}
        render={({ field }) => (
          <ThumbnailUploader
            value={field.value}
            onChange={(file) => field.onChange(file)}
            error={errors.thumbnail?.message as string | undefined}
          />
        )}
      />
    </div>
  );
}

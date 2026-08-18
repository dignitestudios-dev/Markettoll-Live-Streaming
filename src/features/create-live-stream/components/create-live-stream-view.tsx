"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";

import {
  createLiveStreamSchema,
  CreateLiveStreamSchemaType,
} from "../schemas/create-live-stream.schema";
import StreamInfoForm from "./stream-info-form";
import ProductSelectorGrid from "./product-selector-grid";
import ButtonLoader from "@/components/ui/button-loader";
import { uploadThumbnailFile, compressImageFile } from "@/features/home/api/lives.service";

export default function CreateLiveStreamView() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateLiveStreamSchemaType>({
    resolver: zodResolver(createLiveStreamSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      thumbnail: null,
      selectedProductIds: [],
    },
  });

  const onSubmit = async (data: CreateLiveStreamSchemaType) => {
    try {
      setIsSubmitting(true);

      let thumbnailUrl = "";
      if (typeof data.thumbnail === "string" && data.thumbnail) {
        thumbnailUrl = data.thumbnail;
      } else if (data.thumbnail instanceof File) {
        // 1. Try Multipart FormData upload via API endpoint
        thumbnailUrl = await uploadThumbnailFile(data.thumbnail);

        // 2. Fallback to lightweight compressed JPEG Data URL if no remote upload endpoint
        if (!thumbnailUrl) {
          thumbnailUrl = await compressImageFile(data.thumbnail);
        }
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "draft_live_stream",
          JSON.stringify({
            title: data.title,
            description: data.description,
            category: data.category,
            products: data.selectedProductIds || [],
            thumbnail: thumbnailUrl,
          })
        );
      }

      router.push("/pre-stream-setup");
    } catch (error) {
      console.error("Error creating live stream:", error);
      toast.error("Failed to save live stream info. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="w-full max-w-[1240px] bg-[#F7F7F7] rounded-[30px] p-6 sm:p-10 lg:p-14 shadow-sm border border-gray-200/60 flex flex-col gap-6">
        {/* Header: Back button & Title */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200/80">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm sm:text-base font-semibold text-[#003DAC] hover:underline transition-all cursor-pointer"
          >
            <IoArrowBack className="text-lg" /> Back
          </button>

          <h1 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#003DAC] tracking-tight ml-2">
            Create Live Stream
          </h1>
        </div>

        {/* Live Stream Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-8">
          {/* Stream Info (Title, Description, Category, Thumbnail) */}
          <StreamInfoForm
            register={register}
            errors={errors}
            watch={watch}
            control={control}
          />

          {/* Select Products Grid */}
          <Controller
            name="selectedProductIds"
            control={control}
            render={({ field }) => (
              <ProductSelectorGrid
                selectedProductIds={field.value || []}
                onChangeSelected={(ids) => field.onChange(ids)}
                error={errors.selectedProductIds?.message}
              />
            )}
          />

          {/* Submit Button */}
          <div className="w-full flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-[420px] h-[52px] bg-[#0098EA] hover:bg-[#0082c9] active:scale-[0.99] text-white text-base font-bold rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <ButtonLoader size={20} className="text-white" />
                  Creating Stream...
                </>
              ) : (
                "Start Live Stream"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

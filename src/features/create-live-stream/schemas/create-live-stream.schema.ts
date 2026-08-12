import { z } from "zod";

export const createLiveStreamSchema = z.object({
  title: z
    .string()
    .min(3, "Live title must be at least 3 characters long")
    .max(100, "Live title cannot exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description cannot exceed 500 characters"),
  category: z
    .string()
    .min(1, "Please select a category for your live stream"),
  thumbnail: z
    .any()
    .refine((val) => val !== null && val !== undefined && val !== "", {
      message: "Please upload a thumbnail image for your live stream",
    }),
  selectedProductIds: z.array(z.string()),
});

export type CreateLiveStreamSchemaType = z.infer<typeof createLiveStreamSchema>;

import { z } from "zod";

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

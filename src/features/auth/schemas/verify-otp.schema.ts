import { z } from "zod";

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .min(1, "Please enter the OTP")
    .length(4, "OTP must contain 4 digits."),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

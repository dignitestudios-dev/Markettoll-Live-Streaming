import { useMutation } from "@tanstack/react-query";
import {
  loginUser,
  forgotPasswordSendOtp,
  verifyOtpPayload,
  resendOtpPayload,
  updateForgotPasswordPayload,
} from "@/features/auth/api/auth.service";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => forgotPasswordSendOtp(email),
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: (params: {
      otp: string;
      email?: string;
      type?: string;
      from?: string;
      token?: string;
    }) => verifyOtpPayload(params),
  });
}

export function useResendOtpMutation() {
  return useMutation({
    mutationFn: (params: {
      email?: string;
      type?: string;
      from?: string;
      token?: string;
    }) => resendOtpPayload(params),
  });
}

export function useUpdatePasswordMutation() {
  return useMutation({
    mutationFn: (params: { password: string; email: string }) =>
      updateForgotPasswordPayload(params),
  });
}

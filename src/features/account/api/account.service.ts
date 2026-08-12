import axiosInstance from "@/lib/axios";
import { BASE_URL } from "@/api/api";

export async function updateNameApi(name: string, token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await axiosInstance.put(
    `${BASE_URL}/users/name`,
    { name },
    token ? { headers } : undefined
  );
  return response.data;
}

export async function updateProfileImageApi(formData: FormData, token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await axiosInstance.put(
    `${BASE_URL}/users/profile-image`,
    formData,
    token ? { headers } : undefined
  );
  return response.data;
}

export async function sendUpdatePhoneNumberOtpApi(phone: string, token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await axiosInstance.post(
    `${BASE_URL}/users/update-phone-number-send-sms-otp`,
    {
      phoneNumber: {
        code: 1,
        value: phone,
      },
    },
    token ? { headers } : undefined
  );
  return response.data;
}

export async function verifyUpdatePhoneNumberOtpApi(phone: string, otp: string, token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await axiosInstance.post(
    `${BASE_URL}/users/update-phone-number-verify-sms-otp`,
    {
      phoneNumber: {
        code: 1,
        value: phone,
      },
      otp,
    },
    token ? { headers } : undefined
  );
  return response.data;
}

export async function resendPhoneNumberOtpApi(phone: string, token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await axiosInstance.post(
    `${BASE_URL}/users/resend-otp`,
    {
      phoneNumber: {
        code: 1,
        value: phone,
      },
    },
    token ? { headers } : undefined
  );
  return response.data;
}

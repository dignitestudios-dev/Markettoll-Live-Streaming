import axiosInstance from "@/lib/axios";
import { BASE_URL } from "@/api/api";

export interface PushNotificationOptions {
  boostedProductsAndServices: boolean;
  wishlistItems: boolean;
  chatMessages: boolean;
  customerSupport: boolean;
}

export async function updatePushNotificationOptionsApi(
  options: PushNotificationOptions,
  token?: string
) {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await axiosInstance.put(
    `${BASE_URL}/users/push-notification-options`,
    options,
    token ? { headers } : undefined
  );
  return response.data;
}

export async function changePasswordApi(
  payload: { currentPassword: string; newPassword: string },
  token?: string
) {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await axiosInstance.put(
    `${BASE_URL}/users/password`,
    payload,
    token ? { headers } : undefined
  );
  return response;
}

export async function unsubscribeStripeApi(token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await axiosInstance.post(
    `${BASE_URL}/stripe/unsubscribe-paid-plan-stripe`,
    {},
    token ? { headers } : undefined
  );
  return response.data;
}

export async function deleteAccountApi(password: string, token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await axiosInstance.post(
    `${BASE_URL}/users/delete`,
    { password },
    token ? { headers } : undefined
  );
  return response;
}

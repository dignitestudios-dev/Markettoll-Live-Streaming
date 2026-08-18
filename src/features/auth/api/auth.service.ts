import axiosInstance from "@/lib/axios";
import { BASE_URL } from "@/api/api";

export async function loginUser(credentials: { email: string; password: string }): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>(
    `${BASE_URL}/users/email-password-login`,
    {
      email: credentials.email,
      password: credentials.password,
    }
  );
  return response.data;
}

export async function sendFcmToken(fcmToken: string, jwtToken?: string): Promise<void> {
  if (!fcmToken) {
    return;
  }
  // Avoid re-sending the exact same FCM token if already sent during this session
  if (typeof window !== "undefined" && localStorage.getItem("sentFcmToken") === fcmToken) {
    return;
  }
  try {
    const headers: Record<string, string> = {};
    if (jwtToken) {
      headers.Authorization = `Bearer ${jwtToken}`;
    }
    const res = await axiosInstance.post(
      `${BASE_URL}/users/push-notification-token`,
      {
        platform: "web",
        token: fcmToken,
      },
      headers.Authorization ? { headers } : undefined
    );
    if (typeof window !== "undefined") {
      localStorage.setItem("sentFcmToken", fcmToken);
      localStorage.setItem("fcmToken", fcmToken);
    }
  } catch (err: any) {
    const msg = err?.message || err?.response?.data?.message || "";
    if (msg.includes("already exists") || msg.includes("User not found")) {
      console.warn("FCM Token backend status:", msg);
      if (typeof window !== "undefined") {
        localStorage.setItem("sentFcmToken", fcmToken);
      }
    } else {
      console.error("Error sending FCM token to backend:", msg);
    }
  }
}

export async function forgotPasswordSendOtp(email: string) {
  const response = await axiosInstance.post(
    `${BASE_URL}/users/forgot-password-send-email-otp`,
    { email }
  );
  return response.data;
}

export async function verifyOtpPayload(params: {
  otp: string;
  email?: string;
  type?: string;
  from?: string;
  token?: string;
}) {
  const { otp, email, type, from, token } = params;
  const endpoint =
    type === "email"
      ? `${BASE_URL}/users/verify-email-verify-email-otp`
      : type === "forgot-password"
      ? `${BASE_URL}/users/forgot-password-verify-email-otp`
      : `${BASE_URL}/users/verify-phone-number-verify-sms-otp`;

  const headers: Record<string, string> = {};
  if (from !== "forgot-password" && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await axiosInstance.post(
    endpoint,
    { otp, email },
    headers.Authorization ? { headers } : undefined
  );
  return response.data;
}

export async function resendOtpPayload(params: {
  email?: string;
  type?: string;
  from?: string;
  token?: string;
}) {
  const { email, type, from, token } = params;

  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const config = headers.Authorization ? { headers } : undefined;

  if (from === "forgot-password") {
    const response = await axiosInstance.post(
      `${BASE_URL}/users/forgot-password-send-email-otp`,
      { email },
      config
    );
    return response.data;
  } else {
    const endpoint =
      type === "email"
        ? `${BASE_URL}/users/verify-email-send-email-otp`
        : `${BASE_URL}/users/verify-phone-number-send-sms-otp`;

    const response = await axiosInstance.post(endpoint, {}, config);
    return response.data;
  }
}

export async function updateForgotPasswordPayload(params: {
  password: string;
  email: string;
}) {
  const response = await axiosInstance.put(
    `${BASE_URL}/users/forgot-password-update-password`,
    { password: params.password, email: params.email }
  );
  return response.data;
}

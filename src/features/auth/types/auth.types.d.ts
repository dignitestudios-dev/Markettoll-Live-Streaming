interface LoginCredentials {
  email: string;
  password: string;
  fcmToken?: string;
}

interface User {
  _id?: string;
  id?: number | string;
  name?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  gender?: string;
  image?: string;
  profileImage?: string;
  avatar?: string;
  token?: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  data: User & { token?: string };
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}


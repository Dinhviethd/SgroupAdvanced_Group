import api from './api';
import { useAuth, type User } from '../store/authStore';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  name: string;
  phone?: string;
  avatar?: File
}

// -------------------------------------------------------------
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
}



export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    
    if (response.data.success && response.data.data) {
      const { user, accessToken } = response.data.data;
      useAuth.getState().setAuth(user, accessToken);
    }
    
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    
    if (response.data.success && response.data.data) {
      const { user, accessToken } = response.data.data;
      useAuth.getState().setAuth(user, accessToken);
    }
    
    return response.data;
  },

  async logout(): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/auth/logout');
      return response.data;
    } finally {
      useAuth.getState().clearAuth();
    }
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    
    if (response.data.success && response.data.data) {
      useAuth.getState().setUser(response.data.data);
    }
    
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/forgot-password', data);
    return response.data;
  },

  async verifyOTP(data: VerifyOTPRequest): Promise<ApiResponse<{ valid: boolean }>> {
    const response = await api.post<ApiResponse<{ valid: boolean }>>('/auth/verify-otp', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/auth/reset-password', data);
    return response.data;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse> {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.phone) formData.append('phone', data.phone);
    if (data.avatar) formData.append('avatar', data.avatar);
    
    const response = await api.put<ApiResponse>('/auth/me', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    if(response.data.success && response.data.data) {
      useAuth.getState().setUser(response.data.data)
    }
    return response.data
  }
};

export default authService;

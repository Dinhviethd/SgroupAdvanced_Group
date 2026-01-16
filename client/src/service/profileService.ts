import api from './api';
import { useAuth, type User } from '@/store/authStore';

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
}

export const profileService = {
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>('/profile');
    
    if (response.data.success && response.data.data) {
      useAuth.getState().setUser(response.data.data);
    }
    
    return response.data;
  },

  async updateProfile(data: UpdateProfileInput): Promise<ApiResponse<User>> {
    const response = await api.put<ApiResponse<User>>('/profile', data);
    
    if (response.data.success && response.data.data) {
      useAuth.getState().setUser(response.data.data);
    }
    
    return response.data;
  },

  async changePassword(data: ChangePasswordInput): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/profile/change-password', data);
    return response.data;
  },

  async deleteAccount(password: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/profile/delete-account', { password });
    
    if (response.data.success) {
      useAuth.getState().clearAuth();
    }
    
    return response.data;
  },
};

export default profileService;

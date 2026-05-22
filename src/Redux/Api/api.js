import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for cookies/tokens
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// AUTHENTICATION FUNCTIONS - MATCHING YOUR BACKEND ROUTES

// Registration flow with OTP
export const sendRegistrationOTP = async (userData) => {
  const response = await api.post('/api/auth/send-registration-otp', userData);
  return response;
};

export const verifyRegistrationOTP = async (otpData) => {
  const response = await api.post('/api/auth/verify-registration-otp', otpData);
  // Store token if returned
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response;
};

// Google Login
export const googleLogin = async (data) => {
  const response = await api.post('/api/auth/google', data);
  // Store token if returned
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response;
};

// Password reset with OTP
export const forgotPassword = async (email) => {
  const response = await api.post('/api/auth/forgot-password', { email });
  return response;
};

// Reset Password with OTP
export const resetPassword = async ({ email, otp, newPassword }) => {
  const response = await api.post('/api/auth/reset-password', {
    email,
    otp,
    newPassword
  });
  return response;
};

// Token management
export const refreshToken = async () => {
  const response = await api.post('/api/auth/refresh-token');
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response;
};

export const logout = async () => {
  try {
    await api.post('/api/auth/logout');
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// USER PROFILE FUNCTIONS (Protected routes)
export const getCurrentUser = async () => {
  const response = await api.get('/api/users/me');
  return response;
};

export const updateProfile = async (profileData) => {
  const response = await api.patch('/api/users/update-profile', profileData);
  return response;
};

export const changePassword = async (passwordData) => {
  const response = await api.patch('/api/users/change-password', passwordData);
  return response;
};


// Email change with OTP
export const sendEmailChangeOTP = async (newEmail) => {
  const response = await api.post('/api/users/send-email-change-otp', { newEmail });
  return response;
};

// Verify OTP and update email
export const verifyEmailChangeOTP = async (otpData) => {
  const response = await api.post('/api/users/verify-email-change-otp', otpData);
  return response;
};

// Admin functions
export const getAllUsers = async () => {
  const response = await api.get('/api/admin/users');
  return response;
};

export const getUserById = async (id) => {
  const response = await api.get(`/api/users/${id}`);
  return response;
};


export default api;

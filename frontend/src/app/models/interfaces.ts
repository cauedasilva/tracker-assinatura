export interface User {
  _id?: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Subscription {
  _id?: string;
  name: string;
  price: number;
  currency: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category: string;
  paymentMethod: string;
  status?: 'active' | 'canceled' | 'expired';
  startDate: Date;
  renewalDate?: Date;
  user?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
  };
  token: string;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SubscriptionStats {
  total: number;
  active: number;
  expired: number;
  canceled: number;
  monthlyTotal: number;
  yearlyTotal: number;
  byCategory: { [key: string]: number };
}

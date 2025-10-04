// app/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  age?: number;
}

export interface Order {
  id: string;
  item: string;
  userId?: string;
  status?: string;
  createdAt?: string;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

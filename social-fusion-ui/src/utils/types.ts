/* eslint-disable */

export interface FormValues {
  email?: string;
  password?: string;
  confirmPassword?: string;
  profilePic?: File | null;
  [key: string]: any;
}
export interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  fetchData: (endpoint: string, method?: RequestMethod, payload?: Record<string, unknown>) => Promise<void>;
}

export interface FetchDataFunction {
  (endpoint: string, method?: RequestMethod, payload?: any, isFormData?: boolean, withCredentials?: boolean): Promise<void>;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  phoneNumber: string;
  email: string;
  profilePic: string;
}


export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}
export interface UserState {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  profilePic?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

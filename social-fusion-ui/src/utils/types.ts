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
    (endpoint: string, method?: RequestMethod, payload?: any, isFormData?: boolean): Promise<void>;
  }
  
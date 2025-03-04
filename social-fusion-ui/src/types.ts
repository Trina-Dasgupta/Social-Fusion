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
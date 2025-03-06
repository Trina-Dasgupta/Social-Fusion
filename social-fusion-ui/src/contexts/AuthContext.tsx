"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContextType, User } from "@/utils/types";
import { useApi } from "@/hooks/useApi";
import API_ROUTES from "@/constants/apiRoutes";
import Cookies from "js-cookie";


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { fetchData } = useApi();
  const { fetchData: fetchProfileData } = useApi();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserData()
  }, []);
  const fetchUserData = async () => {
    try {
      const response: any = await fetchProfileData(API_ROUTES.AUTH.MYPROFILE, "GET",{} ,false, true);
      if (response?.user) {
        setUser(response.user);
        router.push("/chat");
      }
    } catch (err) {
      console.log(err);
    }
  }
  const logout = async () => {
    try {
      const response: any = await fetchData(API_ROUTES.AUTH.LOGOUT, "GET", null, false, true);
      console.log(response,'responseresponseresponse')
      if (response?.message) {
        setUser(null); 
        router.push("/login");
        Cookies.remove("authToken");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Ensure that useAuth() always returns a valid context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const authRoutes = ["/login", "/register", "/verifyOtp"];

  useEffect(() => {
    if (!user && !authRoutes.includes(pathname)) {
      router.push("/login");
    } else if (user && authRoutes.includes(pathname)) {
      router.push("/chat");
    }
  }, [user, pathname, router]);

  return <>{children}</>;
};

export default AuthGuard;

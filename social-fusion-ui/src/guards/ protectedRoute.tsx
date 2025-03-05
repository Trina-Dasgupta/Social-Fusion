import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useAuth } from "@/contexts/AuthContext";


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (!token) {
      router.push("/login"); 
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
};

export default ProtectedRoute;

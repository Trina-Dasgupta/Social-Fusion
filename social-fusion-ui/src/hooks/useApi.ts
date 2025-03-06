import { useState } from "react";
import { api } from "@/utils/api";
import { FetchDataFunction, } from "@/utils/types";
import Cookies from "js-cookie";

export function useApi<T = unknown>(): { 
  data: T | null; 
  error: string | null; 
  loading: boolean; 
  fetchData: FetchDataFunction 
} {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData: FetchDataFunction = async (endpoint, method = "GET", payload = null, isFormData = false, withCredentials = false) => {
        setLoading(true);
        setError(null);
        setData(null); 
        
        try {
            const token = Cookies.get("authToken");

            const response = await api({
                url: endpoint,
                method,
                data: method !== "GET" ? payload : undefined,
                headers: {
                    "Content-Type": isFormData ? "multipart/form-data" : "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }) 
                },
                withCredentials,
            });

            setData(response.data);
            setError(null);
            return response.data;
        } catch (err: any) {
            setError(err.error || err.message || "An error occurred");
            return null; 
        } finally {
            setLoading(false);
        }
    };

    return { data, error, loading, fetchData };
}



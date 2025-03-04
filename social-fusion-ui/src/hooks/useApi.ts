import { useState } from "react";
import { api } from "@/utils/api";
import { FetchDataFunction, } from "@/utils/types";


export function useApi<T = unknown>(): { data: T | null; error: string | null; loading: boolean; fetchData: FetchDataFunction } {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData: FetchDataFunction = async (endpoint, method = "GET", payload, isFormData = false) => {
        setLoading(true);
        setError(null);
        setData(null); // ✅ Reset data before making a new request

        try {
            const response = await api({
                url: endpoint,
                method,
                data: method !== "GET" ? payload : undefined,
                headers: isFormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" },
            });

            setData(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.error || err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return { data, error, loading, fetchData };
}



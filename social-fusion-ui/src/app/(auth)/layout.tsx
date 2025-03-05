import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/guards/authGuard";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <AuthProvider>
        <AuthGuard>{children}</AuthGuard>
    </AuthProvider>;
}

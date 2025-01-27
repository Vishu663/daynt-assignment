import { useRouter } from "next/navigation";
import { JSX, ReactNode } from "react";
import authService from "../services/authService";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({
  children,
}: AuthGuardProps): JSX.Element | null {
  const router = useRouter();

  if (typeof window !== "undefined" && !authService.isAuthenticated) {
    router.push("/");
    return null;
  }

  return <>{children}</>;
}

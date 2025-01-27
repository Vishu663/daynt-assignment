"use client";

import { JSX, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import authService from "../services/authService";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({
  children,
}: AuthGuardProps): JSX.Element | null {
  const router = useRouter();

  useEffect(() => {
    if (!authService.checkAuth()) {
      router.push("/");
    }
  }, [router]);

  return authService.checkAuth() ? <>{children}</> : null;
}

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { redirectByRole } from "@/lib/auth-utils";
import { GraduationCap, Loader2 } from "lucide-react";

/**
 * /auth/callback
 *
 * Landing page after OAuth (Google) sign-in.
 * Fetches the real user role from the DB and redirects to the correct dashboard.
 * Without this, Google OAuth would always land on /dashboard/user.
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const resolveRole = async () => {
      try {
        const { data } = await authApi.getMe();
        if (cancelled) return;
        const role = data?.data?.role ?? "STUDENT";
        redirectByRole(role, router);
      } catch {
        if (!cancelled) {
          // Fallback if /me fails — send to user dashboard
          redirectByRole("STUDENT", router);
        }
      }
    };

    resolveRole();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
        <GraduationCap className="h-8 w-8 text-primary-foreground" />
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Signing you in…</span>
      </div>
    </div>
  );
}

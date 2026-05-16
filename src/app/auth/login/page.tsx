"use client";
import { Suspense, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { signIn, getSession } from "@/lib/auth-client";
import { authApi } from "@/lib/api";
import { resolvePostLoginPath, type UserRole } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Loader2,
  Chrome,
  ShieldCheck,
  Presentation,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type FormData = z.infer<typeof schema>;

// Demo credential sets — values come from the real backend seed
const DEMO_CREDENTIALS = {
  student: { email: "student@eduai.dev", password: "student123" },
  admin: { email: "admin@eduai.dev", password: "admin123" },
  instructor: { email: "instructor@eduai.dev", password: "instructor123" },
} as const;

// ─── Inner component that uses useSearchParams ───────────────────────────────
function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const redirectingRef = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  /**
   * Fetch the authenticated user's role from the DB and redirect accordingly.
   * This is the single place where post-login redirect happens.
   */
  const handlePostLoginRedirect = async () => {
    if (redirectingRef.current) return;
    redirectingRef.current = true;

    const sessionResult = await getSession();
    if (!sessionResult?.data?.user) {
      redirectingRef.current = false;
      toast.error("Sign-in did not complete. Check your connection and try again.");
      return;
    }

    let role: UserRole | string =
      (sessionResult.data.user as { role?: string }).role ?? "STUDENT";

    try {
      const { data } = await authApi.getMe();
      if (data?.data?.role) role = data.data.role;
    } catch {
      // Fall back to role from Better Auth session when /me is unavailable
    }

    router.push(resolvePostLoginPath(role, nextPath));
    router.refresh();
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error(result.error.message || "Invalid credentials");
        return;
      }

      toast.success("Welcome back!");
      await handlePostLoginRedirect();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Demo login: prefill credentials from the real backend seed data,
   * then programmatically submit the form so the real API is called.
   */
  const handleDemoLogin = async (role: keyof typeof DEMO_CREDENTIALS) => {
    const creds = DEMO_CREDENTIALS[role];
    setDemoLoading(role);
    try {
      setValue("email", creds.email, { shouldValidate: true });
      setValue("password", creds.password, { shouldValidate: true });

      // Small tick to let React update field values before submit
      await new Promise((r) => setTimeout(r, 50));

      const result = await signIn.email({
        email: creds.email,
        password: creds.password,
      });

      if (result.error) {
        toast.error(
          result.error.message ||
          `Demo ${role} login failed. Make sure demo users are seeded on the backend.`
        );
        return;
      }

      toast.success(`Signed in as Demo ${role.charAt(0).toUpperCase() + role.slice(1)}!`);
      await handlePostLoginRedirect();
    } catch {
      toast.error("Demo login failed. Please try again.");
    } finally {
      setDemoLoading(null);
    }
  };

  const handleGoogleLogin = async () => {
    // After Google OAuth, the callback will redirect to /auth/callback
    // which then calls /api/auth-extra/me and redirects by role
    await signIn.social({ provider: "google", callbackURL: "/auth/callback" });
  };

  const isAnyLoading = loading || demoLoading !== null;

  return (
    <Card className="shadow-lg border border-border">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to continue your learning journey</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ── Demo Login Buttons ── */}
        <div className="space-y-2">
          <p className="text-xs text-center text-muted-foreground font-medium uppercase tracking-wider">
            Quick Demo Access
          </p>
          <div className="grid grid-cols-3 gap-2">
            {/* Demo Student */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9 flex-col gap-0.5 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-colors"
              disabled={isAnyLoading}
              onClick={() => handleDemoLogin("student")}
            >
              {demoLoading === "student" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <BookOpen className="h-3.5 w-3.5" />
              )}
              <span>Student</span>
            </Button>

            {/* Demo Instructor */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9 flex-col gap-0.5 border-orange-400/40 text-orange-500 hover:bg-orange-500/5 hover:border-orange-400/70 transition-colors"
              disabled={isAnyLoading}
              onClick={() => handleDemoLogin("instructor")}
            >
              {demoLoading === "instructor" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Presentation className="h-3.5 w-3.5" />
              )}
              <span>Instructor</span>
            </Button>

            {/* Demo Admin */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9 flex-col gap-0.5 border-accent/30 text-accent hover:bg-accent/5 hover:border-accent/50 transition-colors"
              disabled={isAnyLoading}
              onClick={() => handleDemoLogin("admin")}
            >
              {demoLoading === "admin" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5" />
              )}
              <span>Admin</span>
            </Button>
          </div>
        </div>

        {/* ── Google OAuth ── */}
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={handleGoogleLogin}
          disabled={isAnyLoading}
        >
          <Chrome className="h-4 w-4" />
          Continue with Google
        </Button>

        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or email</span>
          <Separator className="flex-1" />
        </div>

        {/* ── Email / Password Form ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
              disabled={isAnyLoading}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={
                  errors.password ? "border-destructive pr-10" : "pr-10"
                }
                disabled={isAnyLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11"
            disabled={isAnyLoading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-primary hover:underline font-medium"
          >
            Sign up free
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Page export — wraps LoginForm in Suspense ────────────────────────────────
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
            <div className="p-1.5 bg-primary rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EduAI
            </span>
          </Link>
        </div>

        <Suspense fallback={
          <Card className="shadow-lg border border-border">
            <CardContent className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        }>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}

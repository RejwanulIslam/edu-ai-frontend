"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard, Users, BookOpen, BarChart3,
  Settings, LogOut, ShieldCheck, ChevronRight,
  ListChecks, MessageSquare, Menu, Sun, Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

const adminNav = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/admin/courses", label: "Manage Courses", icon: BookOpen },
  { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
  { href: "/dashboard/admin/enrollments", label: "Enrollments", icon: ListChecks },
  { href: "/dashboard/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [role, setRole] = useState<string | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    if (session) {
      if ((session.user as any).role) {
        setRole((session.user as any).role);
        setIsRoleLoading(false);
      } else {
        import("@/lib/api").then(({ authApi }) => {
          authApi.getMe().then((res) => {
            setRole(res.data?.data?.role || "STUDENT");
            setIsRoleLoading(false);
          }).catch(() => {
            setRole("STUDENT");
            setIsRoleLoading(false);
          });
        });
      }
    } else if (!isPending) {
      setIsRoleLoading(false);
    }
  }, [session, isPending]);

  useEffect(() => {
    if (!isPending && !isRoleLoading) {
      if (!session) {
        router.replace("/auth/login?next=" + encodeURIComponent(pathname));
        return;
      }
      if (role !== "ADMIN") {
        router.replace("/dashboard/user");
      }
    }
  }, [session, isPending, isRoleLoading, role, router, pathname]);

  if (isPending || isRoleLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-slate-400 animate-pulse">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  if (role !== "ADMIN") return null;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl group">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-extrabold tracking-tight block leading-none mb-1">
              EduAI
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Admin Command</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-4 mt-2">Core Systems</p>
        {adminNav.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden",
                active
                  ? "text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              {active && (
                <motion.div
                  layoutId="adminActiveTab"
                  className="absolute inset-0 bg-indigo-500/20 border border-indigo-500/30 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className={cn("h-4 w-4 shrink-0 relative z-10", active ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-400")} />
              <span className="flex-1 relative z-10">{label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 relative z-10 text-indigo-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 m-4 bg-slate-900 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3 p-1">
          <Avatar className="h-10 w-10 border border-indigo-500/30">
            <AvatarImage src={session.user.image || ""} />
            <AvatarFallback className="bg-indigo-950 text-indigo-400 font-bold">
              {session.user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-slate-200">{session.user.name}</p>
            <p className="text-[11px] text-indigo-400 font-medium tracking-wide">Administrator</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950 text-slate-200 border-r border-slate-800 fixed h-full z-30 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-slate-950 text-slate-200 border-r border-slate-800 shadow-2xl z-50 flex flex-col lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none -z-10" />

        {/* Header */}
        <header className="h-16 bg-background/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-500/20 text-sm font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>System Status: Optimal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse ml-1" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-muted/50 hover:bg-muted"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-all" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-all" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0 border border-border/50 shadow-sm">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                      {session.user.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                <div className="p-2 mb-1 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user.email}</p>
                </div>
                <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                  <Link href="/dashboard/user"><LayoutDashboard className="mr-2 h-4 w-4" /> Student View</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                  <Link href="/dashboard/instructor"><LayoutDashboard className="mr-2 h-4 w-4" /> Instructor Studio</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={async () => { await signOut(); router.push("/"); }}
                  className="rounded-md cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 relative z-10 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

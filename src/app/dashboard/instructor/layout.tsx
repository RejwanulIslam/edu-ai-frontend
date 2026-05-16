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
  LayoutDashboard, BookOpen, BarChart3, Users,
  Settings, LogOut, GraduationCap, ChevronRight,
  Menu, Presentation, Sun, Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

const instructorNav = [
  { href: "/dashboard/instructor", label: "Studio Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/instructor/courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/instructor/students", label: "Students", icon: Users },
  { href: "/dashboard/instructor/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/instructor/settings", label: "Settings", icon: Settings },
];

export default function InstructorDashboardLayout({ children }: { children: React.ReactNode }) {
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
      if (role !== "INSTRUCTOR" && role !== "ADMIN") {
        router.replace("/dashboard/user");
      }
    }
  }, [session, isPending, isRoleLoading, role, router, pathname]);

  if (isPending || isRoleLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading instructor studio…</p>
        </div>
      </div>
    );
  }

  if (role !== "INSTRUCTOR" && role !== "ADMIN") return null;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl group">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all duration-300">
            <Presentation className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent font-extrabold tracking-tight block leading-none mb-1">
              EduAI
            </span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Instructor Studio</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4 mt-2">Tools</p>
        {instructorNav.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden",
                active
                  ? "text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {active && (
                <motion.div
                  layoutId="instructorActiveTab"
                  className="absolute inset-0 bg-orange-500/10 border border-orange-500/20 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className={cn("h-4 w-4 shrink-0 relative z-10", active ? "text-orange-500" : "text-muted-foreground group-hover:text-orange-500")} />
              <span className="flex-1 relative z-10">{label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 relative z-10 text-orange-500" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 m-4 bg-card/50 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-3 p-1">
          <Avatar className="h-10 w-10 border border-border shadow-sm">
            <AvatarImage src={session.user.image || ""} />
            <AvatarFallback className="bg-orange-500/10 text-orange-500 font-bold">
              {session.user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{session.user.name}</p>
            <p className="text-[11px] text-orange-500 font-medium tracking-wide">
              {role === "ADMIN" ? "Admin / Instructor" : "Instructor"}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background selection:bg-orange-500/20">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-card/40 backdrop-blur-xl border-r border-border/50 fixed h-full z-30 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
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
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border shadow-2xl z-50 flex flex-col lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen relative">
        {/* Background blobs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-orange-500/5 blur-[120px]" />
          <div className="absolute bottom-[20%] left-[10%] w-[20%] h-[20%] rounded-full bg-rose-500/5 blur-[100px]" />
        </div>

        {/* Header */}
        <header className="h-16 bg-background/70 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full border border-orange-500/20 text-sm font-medium shadow-sm">
              <GraduationCap className="h-4 w-4" />
              <span>Studio Mode</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-muted/30 hover:bg-muted/60"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-all" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-all" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0 border border-border/50 shadow-sm ml-1">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="bg-orange-500/10 text-orange-500 font-bold text-xs">
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
                {role === "ADMIN" && (
                  <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                    <Link href="/dashboard/admin"><LayoutDashboard className="mr-2 h-4 w-4" /> Admin Panel</Link>
                  </DropdownMenuItem>
                )}
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

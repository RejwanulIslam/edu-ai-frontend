"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard, BookOpen, Brain, Trophy, User,
  Settings, LogOut, GraduationCap, Bell, Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { href: "/dashboard/user", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/user/my-courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/user/ai-chat", label: "AI Assistant", icon: Brain, badge: "AI" },
  { href: "/dashboard/user/achievements", label: "Achievements", icon: Trophy },
  { href: "/dashboard/user/profile", label: "Profile", icon: User },
  { href: "/dashboard/user/settings", label: "Settings", icon: Settings },
];

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [role, setRole] = useState<string | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  // Fetch role if it's missing from session
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

  // Only redirect once we're sure there's no session
  useEffect(() => {
    if (!isPending && !isRoleLoading && !session) {
      router.replace("/auth/login?next=" + encodeURIComponent(pathname));
    }
  }, [session, isPending, isRoleLoading, router, pathname]);

  // Show spinner while loading or redirecting
  if (isPending || isRoleLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl group">
          <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-extrabold tracking-tight">
            EduAI
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 mt-2">Menu</p>
        {sidebarLinks.map(({ href, label, icon: Icon, exact, badge }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden",
                active
                  ? "text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {active && (
                <motion.div
                  layoutId="userActiveTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className={cn("h-4 w-4 shrink-0 relative z-10 transition-colors", active ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
              <span className="flex-1 relative z-10">{label}</span>
              {badge && (
                <Badge className="relative z-10 text-[10px] px-1.5 py-0 bg-gradient-to-r from-accent to-pink-500 text-white border-0 shadow-sm">
                  {badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 m-4 border border-border/50 bg-muted/30 rounded-2xl">
        <div className="flex items-center gap-3 p-1">
          <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
            <AvatarImage src={session.user.image || ""} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {session.user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{session.user.name}</p>
            <p className="text-[11px] text-muted-foreground truncate uppercase tracking-wide">
              {role ?? "STUDENT"}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background selection:bg-primary/20">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-card/50 backdrop-blur-xl border-r border-border/50 fixed h-full z-30 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay & Sidebar */}
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
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        {/* Top Header */}
        <header className="h-16 bg-background/70 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden lg:flex items-center text-sm font-medium text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              Welcome back,{" "}
              <span className="text-foreground ml-1 font-semibold">
                {session.user.name?.split(" ")[0]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground mr-1"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-all" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-all" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0 border border-border/50 shadow-sm focus-visible:ring-1 focus-visible:ring-primary">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {session.user.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 border-border/50 shadow-xl">
                <div className="p-2 mb-2 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium leading-none">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground mt-1.5">{session.user.email}</p>
                </div>
                <DropdownMenuItem asChild className="rounded-md cursor-pointer hover:bg-primary/5 hover:text-primary">
                  <Link href="/dashboard/user/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-md cursor-pointer hover:bg-primary/5 hover:text-primary">
                  <Link href="/dashboard/user/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
                </DropdownMenuItem>
                {/* Role shortcuts */}
                {role === "ADMIN" && (
                  <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                    <Link href="/dashboard/admin"><LayoutDashboard className="mr-2 h-4 w-4" /> Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                {(role === "INSTRUCTOR" || role === "ADMIN") && (
                  <DropdownMenuItem asChild className="rounded-md cursor-pointer">
                    <Link href="/dashboard/instructor"><LayoutDashboard className="mr-2 h-4 w-4" /> Instructor Studio</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-border/50 my-1" />
                <DropdownMenuItem
                  onClick={async () => { await signOut(); router.push("/"); }}
                  className="rounded-md cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 relative z-10 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

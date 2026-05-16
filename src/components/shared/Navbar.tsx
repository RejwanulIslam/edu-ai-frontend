"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GraduationCap, Menu, X, Sun, Moon,
  LayoutDashboard, User, LogOut, Settings,
  Brain, ShieldCheck, Presentation, BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const publicNav = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

/** Returns the primary dashboard path for a given role */
function getDashboardHref(role?: string) {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "INSTRUCTOR") return "/dashboard/instructor";
  return "/dashboard/user";
}

/** Returns the label for the "My Dashboard" link */
function getDashboardLabel(role?: string) {
  if (role === "ADMIN") return "Admin Panel";
  if (role === "INSTRUCTOR") return "Instructor Studio";
  return "My Learning";
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  const user = session?.user;
  const role = (user as any)?.role as string | undefined;
  const dashboardHref = getDashboardHref(role);
  const dashboardLabel = getDashboardLabel(role);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const authNav = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: dashboardHref, label: dashboardLabel },
    { href: "/dashboard/user/ai-chat", label: "AI Assistant" },
    { href: "/about", label: "About" },
  ];

  const navLinks = user ? authNav : publicNav;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl group shrink-0">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-1.5 bg-gradient-to-br from-primary to-accent rounded-lg shadow-sm"
            >
              <GraduationCap className="h-5 w-5 text-white" />
            </motion.div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EduAI
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {isActive(link.href) && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 bg-primary/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-full"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {user ? (
              /* ── Authenticated: Avatar Dropdown ── */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0 ring-2 ring-transparent hover:ring-primary/30 transition-all"
                    aria-label="Open user menu"
                  >
                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                      <AvatarImage src={user.image || ""} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                        {user.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 rounded-2xl p-2 shadow-2xl border border-border/50" align="end" forceMount>
                  {/* User info header */}
                  <div className="flex items-center gap-3 p-3 mb-1 bg-muted/30 rounded-xl">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    {role && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] px-2 py-0.5 border-0 font-semibold shrink-0",
                          role === "ADMIN" && "bg-indigo-500/15 text-indigo-500",
                          role === "INSTRUCTOR" && "bg-orange-500/15 text-orange-500",
                          role === "STUDENT" && "bg-primary/15 text-primary"
                        )}
                      >
                        {role === "ADMIN" ? "Admin" : role === "INSTRUCTOR" ? "Instructor" : "Student"}
                      </Badge>
                    )}
                  </div>

                  {/* Primary dashboard */}
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5 hover:bg-primary/5 focus:bg-primary/5">
                    <Link href={dashboardHref} className="flex items-center gap-2">
                      {role === "ADMIN" ? <ShieldCheck className="h-4 w-4 text-indigo-500" />
                        : role === "INSTRUCTOR" ? <Presentation className="h-4 w-4 text-orange-500" />
                        : <LayoutDashboard className="h-4 w-4 text-primary" />}
                      {dashboardLabel}
                    </Link>
                  </DropdownMenuItem>

                  {/* AI Assistant */}
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5 hover:bg-accent/5 focus:bg-accent/5">
                    <Link href="/dashboard/user/ai-chat" className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-accent" />
                      AI Assistant
                    </Link>
                  </DropdownMenuItem>

                  {/* My Courses (always visible) */}
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                    <Link href="/dashboard/user/my-courses" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      My Courses
                    </Link>
                  </DropdownMenuItem>

                  {/* Admin can switch to other dashboards */}
                  {role === "ADMIN" && (
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                      <Link href="/dashboard/instructor" className="flex items-center gap-2">
                        <Presentation className="h-4 w-4 text-orange-500" />
                        Instructor Studio
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="my-1 bg-border/50" />

                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                    <Link href="/dashboard/user/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                    <Link href="/dashboard/user/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 bg-border/50" />

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="rounded-xl cursor-pointer py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* ── Unauthenticated: Sign In / Get Started ── */
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="rounded-full">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="rounded-full bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                >
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 rounded-full"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle mobile menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-background/98 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  <div className="h-px bg-border/50 my-2" />
                  <div className="flex items-center gap-3 px-4 py-2">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {user.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-border mt-2">
                  <Button variant="outline" asChild className="rounded-xl">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild className="rounded-xl bg-gradient-to-r from-primary to-accent text-white border-0">
                    <Link href="/auth/register">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

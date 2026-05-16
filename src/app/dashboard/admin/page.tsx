"use client";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { Users, BookOpen, GraduationCap, TrendingUp, Loader2, Server, Activity, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#3b82f6"];

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => usersApi.getAdminStats().then((r) => r.data),
  });

  const stats = data?.data;

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-indigo-500", gradient: "from-indigo-500/20 to-transparent", border: "border-indigo-500/20" },
    { label: "Total Courses", value: stats?.totalCourses || 0, icon: BookOpen, color: "text-purple-500", gradient: "from-purple-500/20 to-transparent", border: "border-purple-500/20" },
    { label: "Total Enrollments", value: stats?.totalEnrollments || 0, icon: GraduationCap, color: "text-pink-500", gradient: "from-pink-500/20 to-transparent", border: "border-pink-500/20" },
    { label: "Monthly Growth", value: "+12%", icon: TrendingUp, color: "text-emerald-500", gradient: "from-emerald-500/20 to-transparent", border: "border-emerald-500/20" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sm text-muted-foreground font-medium animate-pulse">Initializing Command Center...</p>
      </div>
    );
  }

  // Transform monthly enrollments to match Recharts expectations
  const areaData = stats?.monthlyEnrollments?.map((m: any) => ({
    name: m.month,
    uv: m.count,
  })) || [];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
        >
          Command Center
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-sm mt-1"
        >
          System overview and high-level platform metrics
        </motion.p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
          >
            <Card className={`border ${card.border} bg-card/40 backdrop-blur-md overflow-hidden relative group hover:border-opacity-50 transition-all duration-300`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-background/50 backdrop-blur-sm border ${card.border} shadow-sm`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <Badge variant="outline" className={`bg-background/50 ${card.color} border-0 shadow-sm`}>+2%</Badge>
                </div>
                <div className="text-3xl font-black mb-1 tracking-tight">{typeof card.value === 'number' ? card.value.toLocaleString() : card.value}</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Area chart - monthly enrollments */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full border-border/50 bg-card/40 backdrop-blur-sm shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-500" /> Enrollment Velocity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Area type="monotone" dataKey="uv" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie chart - user roles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full border-border/50 bg-card/40 backdrop-blur-sm shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Globe className="h-4 w-4 text-purple-500" /> Demographics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Students", value: Math.max((stats?.totalUsers || 0) - 10, 0) },
                        { name: "Instructors", value: 8 },
                        { name: "Admins", value: 2 },
                      ]}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {COLORS.map((color, i) => (
                        <Cell key={i} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} 
                      itemStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Status & Recent Users */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <motion.div 
          className="lg:col-span-1 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Server className="h-4 w-4 text-emerald-500" /> System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">API Latency</span>
                  <span className="font-medium text-emerald-500">42ms</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[15%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Database Load</span>
                  <span className="font-medium text-indigo-500">28%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[28%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Storage Capacity</span>
                  <span className="font-medium text-purple-500">64%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[64%]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-pink-500" /> Recent Registrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentUsers?.map((user: any, idx: number) => (
                  <div key={user.id} className="flex items-center gap-4 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors">
                    <Avatar className="h-10 w-10 shrink-0 border border-border shadow-sm">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0 uppercase tracking-wider font-semibold border-border/50 shadow-sm">{user.role}</Badge>
                    <span className="text-xs text-muted-foreground shrink-0 hidden sm:block font-medium">
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

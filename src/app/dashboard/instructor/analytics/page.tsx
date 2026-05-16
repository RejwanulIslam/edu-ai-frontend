"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { TrendingUp, Users, DollarSign, Clock, ArrowUpRight, Award } from "lucide-react";
import { motion } from "framer-motion";

// High-end Mock Data for Studio Analytics
const revenueData = [
  { name: "Jan", uv: 400 }, { name: "Feb", uv: 600 }, { name: "Mar", uv: 850 },
  { name: "Apr", uv: 1200 }, { name: "May", uv: 950 }, { name: "Jun", uv: 1400 },
  { name: "Jul", uv: 1800 },
];

const coursePerformance = [
  { name: "React Patterns", students: 420 },
  { name: "Next.js Fullstack", students: 380 },
  { name: "TypeScript Basics", students: 210 },
  { name: "CSS Mastery", students: 150 },
];

const studentRetention = [
  { name: "Completed", value: 45 },
  { name: "In Progress", value: 35 },
  { name: "Dropped", value: 20 },
];

const COLORS = ["#f97316", "#f43f5e", "#64748b"];

export default function InstructorAnalyticsPage() {
  const statCards = [
    { label: "Total Revenue", value: "$6,500.00", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", trend: "+15%" },
    { label: "Active Students", value: "1,160", icon: Users, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", trend: "+8%" },
    { label: "Watch Time (hrs)", value: "3,420", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", trend: "+22%" },
    { label: "Certificates Issued", value: "345", icon: Award, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", trend: "+5%" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold tracking-tight"
        >
          Studio Analytics
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-sm mt-1"
        >
          Detailed insights into your teaching business performance.
        </motion.p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`border ${card.border} bg-card/40 backdrop-blur-md overflow-hidden relative group hover:shadow-md transition-all duration-300`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${card.bg} border ${card.border}`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <Badge variant="outline" className={`bg-background shadow-sm border-border/50 text-[10px] font-bold flex items-center gap-0.5`}>
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" /> {card.trend}
                  </Badge>
                </div>
                <div className="text-3xl font-bold tracking-tight mb-1">{card.value}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{card.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Revenue Chart */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full border-border/50 bg-card/40 backdrop-blur-sm shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" /> Revenue Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} className="text-muted-foreground" tickFormatter={(val) => `$${val}`} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                      itemStyle={{ color: "hsl(var(--foreground))" }}
                      formatter={(value: number) => [`$${value}`, "Revenue"]}
                    />
                    <Area type="monotone" dataKey="uv" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Retention Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full border-border/50 bg-card/40 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-2 border-b border-border/50">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-rose-500" /> Student Retention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-6 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-rose-500/5 rounded-full blur-3xl" />
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={studentRetention}
                      cx="50%"
                      cy="45%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {studentRetention.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} 
                      itemStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
                      formatter={(value: number) => [`${value}%`, "Students"]}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Performing Courses */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" /> Top Performing Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={coursePerformance} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border/50" />
                  <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} className="text-muted-foreground" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={120} className="text-foreground font-medium" />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                  />
                  <Bar dataKey="students" fill="#f97316" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

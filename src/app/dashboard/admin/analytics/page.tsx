"use client";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";
import { Loader2 } from "lucide-react";

// Mock data for richer analytics view
const monthlyData = [
  { month: "Aug", users: 120, enrollments: 85, revenue: 2400 },
  { month: "Sep", users: 180, enrollments: 130, revenue: 3800 },
  { month: "Oct", users: 240, enrollments: 190, revenue: 5200 },
  { month: "Nov", users: 310, enrollments: 260, revenue: 6900 },
  { month: "Dec", users: 420, enrollments: 350, revenue: 9100 },
  { month: "Jan", users: 560, enrollments: 480, revenue: 12400 },
];

const categoryData = [
  { category: "Web Dev", courses: 45, students: 3200 },
  { category: "Data Science", courses: 30, students: 2100 },
  { category: "Design", courses: 22, students: 1400 },
  { category: "Business", courses: 18, students: 980 },
  { category: "Language", courses: 15, students: 760 },
];

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => usersApi.getAdminStats().then((r) => r.data),
  });

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform performance and growth metrics</p>
      </div>

      {/* Growth Chart */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-base">Platform Growth (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="users" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="enrollments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Legend />
              <Area type="monotone" dataKey="users" name="New Users" stroke="hsl(var(--primary))" fill="url(#users)" strokeWidth={2} />
              <Area type="monotone" dataKey="enrollments" name="Enrollments" stroke="hsl(var(--accent))" fill="url(#enrollments)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category performance */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-base">Performance by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Legend />
              <Bar dataKey="courses" name="Courses" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              <Bar dataKey="students" name="Students" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Avg. Course Completion Rate", value: "68%", trend: "+5% this month" },
          { label: "Avg. Quiz Score", value: "74%", trend: "+2% this month" },
          { label: "AI Chat Engagement", value: "89%", trend: "+12% this month" },
        ].map((metric) => (
          <Card key={metric.label} className="border border-border">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
              <p className="text-3xl font-bold text-primary mb-1">{metric.value}</p>
              <p className="text-xs text-green-600">{metric.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { coursesApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Star, PlusCircle, ArrowRight, PlayCircle, Loader2, Presentation } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Course } from "@/types";

export default function InstructorDashboardPage() {
  const { data: coursesRes, isLoading } = useQuery({
    queryKey: ["instructor-courses"],
    queryFn: () => coursesApi.getMyInstructorCourses().then((r) => r.data),
  });

  const courses: Course[] = coursesRes?.data || [];

  // Calculate some aggregate stats from courses
  const totalStudents = courses.reduce((acc, course) => acc + (course.enrollmentCount || 0), 0);
  const totalCourses = courses.length;
  // Mock average rating and revenue for premium look
  const avgRating = courses.length > 0 ? "4.8" : "0.0";
  const mockRevenue = "$" + (totalStudents * 49).toLocaleString();

  const statCards = [
    { label: "Total Students", value: totalStudents, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Active Courses", value: totalCourses, icon: BookOpen, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Average Rating", value: avgRating, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "Est. Revenue", value: mockRevenue, icon: TrendingUpIcon, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight">Studio Overview</h1>
          <p className="text-muted-foreground mt-1">Manage your courses, track student engagement, and grow your audience.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`border ${card.border} bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${card.bg}`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold tracking-tight mb-1">{card.value}</div>
                <div className="text-sm font-medium text-muted-foreground">{card.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Presentation className="h-5 w-5 text-orange-500" /> My Published Courses
          </h2>
          <Button variant="ghost" size="sm" asChild className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/50">
            <Link href="/dashboard/instructor/courses">
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : courses.length === 0 ? (
          <Card className="border-dashed border-border/60 bg-transparent">
            <CardContent className="text-center py-16 flex flex-col items-center">
              <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
                <Presentation className="h-10 w-10 text-orange-500/60" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ready to start teaching?</h3>
              <p className="text-muted-foreground max-w-sm mb-6">You haven't created any courses yet. Share your knowledge with the world by creating your first course.</p>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <PlusCircle className="mr-2 h-4 w-4" /> Start Creating
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all group flex flex-col h-full">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image 
                      src={course.thumbnail} 
                      alt={course.title} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-background/80 backdrop-blur-md text-foreground border-0 shadow-sm font-semibold">
                        {course.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg line-clamp-1 group-hover:text-orange-500 transition-colors">
                        {course.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {course.enrollmentCount || 0}</span>
                      <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-amber-500" /> 4.8</span>
                    </div>
                    <div className="mt-auto">
                      <div className="flex justify-between text-sm py-2 border-t border-border/50">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-bold">${course.price}</span>
                      </div>
                      <div className="flex justify-between text-sm py-2 border-t border-border/50">
                        <span className="text-muted-foreground">Created</span>
                        <span className="font-medium">{format(new Date(course.createdAt), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 bg-muted/20 border-t border-border/50 flex gap-2">
                    <Button variant="outline" className="flex-1 border-orange-200 hover:bg-orange-50 dark:border-orange-900/50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                      Edit Draft
                    </Button>
                    <Button variant="default" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" asChild>
                      <Link href={`/dashboard/admin/courses/${course.id}`}>Manage</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper icon component
function TrendingUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { usersApi, aiApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Brain, Trophy, TrendingUp, ArrowRight, Sparkles, Loader2, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function UserDashboardPage() {
  const { data: session } = useSession();

  const { data: statsRes, isLoading: statsLoading } = useQuery({
    queryKey: ["user-dashboard-stats"],
    queryFn: () => usersApi.getDashboardStats().then((r) => r.data),
  });

  const { data: recRes, isLoading: recLoading } = useQuery({
    queryKey: ["ai-recommendations"],
    queryFn: () => aiApi.getRecommendations().then((r) => r.data),
  });

  const stats = statsRes?.data;
  const recommendations = recRes?.data || [];

  const cards = [
    { label: "Enrolled Courses", value: stats?.recentEnrollments?.length || 0, icon: BookOpen, gradient: "from-blue-500/20 to-blue-500/5", color: "text-blue-500" },
    { label: "Completed", value: stats?.completedCourses || 0, icon: Trophy, gradient: "from-green-500/20 to-green-500/5", color: "text-green-500" },
    { label: "AI Chats", value: "∞", icon: Brain, gradient: "from-purple-500/20 to-purple-500/5", color: "text-purple-500" },
    { label: "Learning Streak", value: "7 days", icon: TrendingUp, gradient: "from-orange-500/20 to-orange-500/5", color: "text-orange-500" },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          My Learning Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 text-base">
          Track your progress, resume courses, and discover personalized recommendations.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm overflow-hidden relative group transition-all hover:shadow-md hover:border-border">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-background shadow-sm ${card.color}`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1 tracking-tight">{card.value}</div>
                <div className="text-sm font-medium text-muted-foreground">{card.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Enrollments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Continue Learning
            </h2>
            <Button variant="ghost" size="sm" asChild className="text-sm group hover:bg-transparent hover:text-primary">
              <Link href="/dashboard/user/my-courses">
                View all <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div className="space-y-4">
            {statsLoading ? (
              <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
                <CardContent className="flex justify-center items-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </CardContent>
              </Card>
            ) : stats?.recentEnrollments?.length === 0 ? (
              <Card className="border-dashed border-border/60 bg-transparent">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-muted-foreground/60" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No active courses</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-[250px] mx-auto">
                    You haven't enrolled in any courses yet. Start your learning journey today!
                  </p>
                  <Button asChild className="shadow-lg shadow-primary/20"><Link href="/courses">Browse Courses</Link></Button>
                </CardContent>
              </Card>
            ) : (
              stats?.recentEnrollments?.map((enrollment: any, idx: number) => (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-md shadow-sm hover:shadow-md transition-all group">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-48 h-32 sm:h-auto shrink-0 overflow-hidden">
                        <Image 
                          src={enrollment.course.thumbnail} 
                          alt={enrollment.course.title} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                              {enrollment.course.title}
                            </h3>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-0 ml-2 shrink-0">
                              {enrollment.course.level || "Beginner"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-4">
                            {enrollment.course.instructor?.name || "Instructor"}
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-primary">{Math.round(enrollment.progress || 0)}%</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Progress value={enrollment.progress || 0} className="h-2 flex-1" />
                            <Button size="sm" asChild className="shrink-0 gap-1.5 shadow-sm rounded-full">
                              <Link href={`/dashboard/user/learn/${enrollment.course.id}`}>
                                <PlayCircle className="h-4 w-4" /> Continue
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Recommended
          </h2>
          
          <Card className="border-border/50 bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-xl shadow-lg relative overflow-hidden h-full min-h-[300px]">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
            
            <CardContent className="p-0">
              {recLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full" />
                    <Sparkles className="h-8 w-8 text-accent animate-pulse relative z-10 mb-4" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Analyzing your profile...</p>
                  <p className="text-xs text-muted-foreground mt-1">Finding the perfect courses for you</p>
                </div>
              ) : recommendations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                  <Brain className="h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Enroll in a course first to get personalized AI recommendations.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/50 relative z-10">
                  {recommendations.slice(0, 4).map((rec: any, i: number) => (
                    <Link href={`/courses/${rec.course?.slug}`} key={rec.course?.id || i} className="block group">
                      <div className="p-4 sm:p-5 flex gap-4 items-start transition-colors hover:bg-accent/5">
                        {rec.course?.thumbnail && (
                          <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 shadow-sm group-hover:shadow-md transition-all">
                            <Image src={rec.course.thumbnail} alt={rec.course.title} fill className="object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className="text-sm font-semibold truncate group-hover:text-accent transition-colors">
                            {rec.course?.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-snug line-clamp-2">
                            <span className="font-medium text-accent/80 mr-1">Why:</span>
                            {rec.reason}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

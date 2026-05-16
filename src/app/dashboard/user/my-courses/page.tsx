"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { enrollmentsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Enrollment } from "@/types";
import { BookOpen, Loader2, Play, CheckCircle2 } from "lucide-react";
import { formatDuration, cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function MyCoursesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: () => enrollmentsApi.getMyEnrollments().then((r) => r.data),
  });

  const enrollments: Enrollment[] = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="text-muted-foreground text-sm mt-1">{enrollments.length} course{enrollments.length !== 1 ? "s" : ""} enrolled</p>
        </div>
        <Button asChild size="sm">
          <Link href="/courses">Find More Courses</Link>
        </Button>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
          <p className="text-muted-foreground mb-4">Start learning by enrolling in your first course</p>
          <Button asChild><Link href="/courses">Browse Courses</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {enrollments.map((enrollment, i) => (
            <motion.div
              key={enrollment.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="overflow-hidden border border-border hover:shadow-md transition-all duration-300 h-full flex flex-col">
                <div className="relative aspect-video">
                  <Image
                    src={enrollment.course.thumbnail}
                    alt={enrollment.course.title}
                    fill
                    className="object-cover"
                  />
                  {enrollment.status === "COMPLETED" && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <CheckCircle2 className="h-10 w-10 text-green-400" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <Badge
                    className={cn(
                      "self-start text-xs mb-2 border-0",
                      enrollment.status === "COMPLETED"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {enrollment.status === "COMPLETED" ? "Completed" : "In Progress"}
                  </Badge>

                  <h3 className="font-semibold text-sm leading-snug mb-1 line-clamp-2">{enrollment.course.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{enrollment.course.instructor?.name}</p>

                  <div className="mt-auto space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span className="font-medium text-foreground">{Math.round(enrollment.progress || 0)}%</span>
                      </div>
                      <Progress value={enrollment.progress || 0} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{enrollment.course._count?.lessons || 0} lessons</span>
                      {enrollment.course.duration > 0 && <span>{formatDuration(enrollment.course.duration)}</span>}
                    </div>

                    <Button size="sm" className="w-full gap-1.5" asChild>
                      <Link href={`/courses/${enrollment.course.slug}`}>
                        <Play className="h-3.5 w-3.5 fill-current" />
                        {enrollment.status === "COMPLETED" ? "Review Course" : "Continue Learning"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

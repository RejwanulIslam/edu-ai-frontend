"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { coursesApi, enrollmentsApi, quizApi } from "@/lib/api";
import { Course, Lesson, Quiz } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, PlayCircle, FileText, CheckCircle2, ChevronLeft, HelpCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function LearnCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const queryClient = useQueryClient();

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const { data: courseRes, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesApi.getById(courseId).then((r) => r.data),
  });

  const { data: quizzesRes } = useQuery({
    queryKey: ["quizzes", courseId],
    queryFn: () => quizApi.getByCourse(courseId).then((r) => r.data),
    enabled: !!courseId,
  });

  const course: Course & { isEnrolled?: boolean } = courseRes?.data;
  const quizzes: Quiz[] = quizzesRes?.data || [];
  
  // Sort lessons by order
  const lessons = course?.lessons?.sort((a, b) => a.order - b.order) || [];
  
  const updateProgressMutation = useMutation({
    mutationFn: (progress: number) => enrollmentsApi.updateProgress(courseId, progress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
    }
  });

  useEffect(() => {
    if (lessons.length > 0 && !activeLessonId) {
      setActiveLessonId(lessons[0].id);
    }
  }, [lessons, activeLessonId]);

  if (isLoadingCourse) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Course not found</h2>
        <Button onClick={() => router.push("/dashboard/user/my-courses")}>Back to My Courses</Button>
      </div>
    );
  }

  if (!course.isEnrolled) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">You are not enrolled in this course</h2>
        <Button onClick={() => router.push(`/courses/${course.slug}`)}>View Course Details</Button>
      </div>
    );
  }

  const activeLesson = lessons.find(l => l.id === activeLessonId);

  const handleLessonComplete = () => {
    if (!activeLesson) return;
    const currentIndex = lessons.findIndex(l => l.id === activeLessonId);
    
    // Calculate new progress
    // Very simple progress calculation based on lessons
    const newProgress = Math.min(100, Math.round(((currentIndex + 1) / lessons.length) * 100));
    
    updateProgressMutation.mutate(newProgress, {
      onSuccess: () => {
        toast.success("Progress saved!");
        if (currentIndex < lessons.length - 1) {
          setActiveLessonId(lessons[currentIndex + 1].id);
        } else {
          toast.success("You have completed all lessons!");
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/user/my-courses">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground text-sm">Continue your learning journey</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeLesson ? (
            <Card className="overflow-hidden border-border shadow-sm">
              {activeLesson.videoUrl ? (
                <div className="aspect-video bg-black relative">
                  {/* Real implementation would use a proper video player */}
                  <iframe 
                    src={activeLesson.videoUrl} 
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                    title={activeLesson.title}
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted/30 flex items-center justify-center border-b border-border">
                  <FileText className="h-16 w-16 text-muted-foreground/50" />
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
                    <Badge variant="secondary" className="mb-4">Lesson {activeLesson.order + 1}</Badge>
                  </div>
                  <Button 
                    onClick={handleLessonComplete}
                    disabled={updateProgressMutation.isPending}
                  >
                    {updateProgressMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Mark as Complete
                  </Button>
                </div>
                
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none"
                     dangerouslySetInnerHTML={{ __html: activeLesson.content }} 
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[400px] flex items-center justify-center border-border">
              <div className="text-center text-muted-foreground">
                <p>Select a lesson from the sidebar to begin</p>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Course Content
              </h3>
              
              <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
                {lessons.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No lessons available yet.</p>
                ) : (
                  lessons.map((lesson, idx) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLessonId(lesson.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg text-sm transition-colors flex items-start gap-3",
                        activeLessonId === lesson.id 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <div className="mt-0.5">
                        {lesson.videoUrl ? <PlayCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <span className="line-clamp-2">{idx + 1}. {lesson.title}</span>
                        {lesson.duration > 0 && (
                          <span className="text-xs opacity-70 mt-1 block">{lesson.duration} min</span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {quizzes.length > 0 && (
            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-accent" />
                  Quizzes
                </h3>
                <div className="space-y-2">
                  {quizzes.map((quiz) => (
                    <Button 
                      key={quiz.id} 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-3"
                      asChild
                    >
                      <Link href={`/dashboard/user/learn/${courseId}/quiz/${quiz.id}`}>
                        <div className="flex-1">
                          <div className="font-medium">{quiz.title}</div>
                          {quiz.timeLimit && (
                            <div className="text-xs text-muted-foreground mt-1">{quiz.timeLimit} mins</div>
                          )}
                        </div>
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

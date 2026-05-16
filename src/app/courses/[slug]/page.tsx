"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { CourseCard } from "@/components/shared/CourseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { coursesApi, enrollmentsApi } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Course, Review } from "@/types";
import {
  Star, Clock, Users, BookOpen, Play, Lock,
  CheckCircle2, Globe, BarChart3, Loader2
} from "lucide-react";
import { formatPrice, formatDuration, getLevelColor, cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: courseRes, isLoading } = useQuery({
    queryKey: ["course", params.slug],
    queryFn: () => coursesApi.getBySlug(params.slug as string).then((r) => r.data),
  });

  const course: Course & { isEnrolled?: boolean; reviews?: Review[] } = courseRes?.data;

  const enrollMutation = useMutation({
    mutationFn: () => enrollmentsApi.enroll(course.id),
    onSuccess: () => {
      toast.success("Enrolled successfully! Start learning now.");
      queryClient.invalidateQueries({ queryKey: ["course", params.slug] });
    },
    onError: (err: any) => {
      if (err.response?.status === 401) router.push("/auth/login");
      else toast.error(err.response?.data?.message || "Enrollment failed");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Course not found</h2>
            <Button onClick={() => router.push("/courses")}>Browse Courses</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <div className="bg-muted/40 border-b border-border py-10">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge className={cn("border-0", getLevelColor(course.level))}>{course.level}</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <p className="text-muted-foreground mb-6">{course.shortDesc}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-foreground">{course.rating.toFixed(1)}</span>
                    <span>({course.totalRatings} ratings)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.totalStudents.toLocaleString()} students</span>
                  </div>
                  {course.duration > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(course.duration)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span>{course.language}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={course.instructor?.image || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {course.instructor?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">By <span className="font-medium">{course.instructor?.name}</span></span>
                </div>
              </div>

              {/* Enrollment Card */}
              <Card className="shadow-lg border-2 border-border lg:sticky lg:top-20">
                <CardContent className="p-6">
                  <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                    <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <Play className="h-6 w-6 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>

                  <div className="text-3xl font-bold mb-1">
                    {course.price === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(course.price)
                    )}
                  </div>

                  {course.isEnrolled ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                        <CheckCircle2 className="h-4 w-4" /> You are enrolled
                      </div>
                      <Button className="w-full" onClick={() => router.push(`/dashboard/user/learn/${course.id}`)}>
                        Continue Learning
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full mt-3"
                      onClick={() => {
                        if (!session) router.push("/auth/login");
                        else enrollMutation.mutate();
                      }}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enrolling...</>
                      ) : course.price === 0 ? "Enroll Free" : `Enroll — ${formatPrice(course.price)}`}
                    </Button>
                  )}

                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> {course._count?.lessons || 0} lessons</div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {course.totalStudents} enrolled</div>
                    <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> {course.level} level</div>
                    <div className="flex items-center gap-2"><Globe className="h-4 w-4" /> {course.language}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum ({course._count?.lessons || 0})</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({course._count?.reviews || 0})</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="max-w-3xl">
                <h2 className="text-xl font-bold mb-4">About This Course</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{course.description}</p>
                {course.tags?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="curriculum">
              <div className="max-w-3xl space-y-2">
                {course.lessons?.map((lesson, i) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {lesson.isPreview || course.isEnrolled ? (
                        <Play className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{lesson.title}</p>
                      {lesson.duration > 0 && (
                        <p className="text-xs text-muted-foreground">{formatDuration(lesson.duration)}</p>
                      )}
                    </div>
                    {lesson.isPreview && !course.isEnrolled && (
                      <Badge variant="outline" className="text-xs shrink-0">Preview</Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="max-w-3xl space-y-4">
                {course.reviews?.length === 0 ? (
                  <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                ) : (
                  course.reviews?.map((review) => (
                    <Card key={review.id} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={review.user.image || ""} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {review.user.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{review.user.name}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, j) => (
                                  <Star key={j} className={cn("h-3.5 w-3.5", j < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="instructor">
              <div className="max-w-2xl">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={course.instructor?.image || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {course.instructor?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{course.instructor?.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {course.instructor?.bio || "Expert instructor with years of professional experience."}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

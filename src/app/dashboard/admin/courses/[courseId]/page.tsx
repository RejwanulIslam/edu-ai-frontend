"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi, quizApi, aiApi } from "@/lib/api";
import { Course, Lesson, Quiz } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Plus, Edit, Trash2, BookOpen, HelpCircle, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const queryClient = useQueryClient();

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const { data: courseRes, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["admin-course", courseId],
    queryFn: () => coursesApi.getById(courseId).then(r => r.data),
  });

  const { data: quizzesRes } = useQuery({
    queryKey: ["admin-quizzes", courseId],
    queryFn: () => quizApi.getByCourse(courseId).then(r => r.data),
  });

  const deleteLessonMutation = useMutation({
    mutationFn: (lessonId: string) => coursesApi.deleteLesson(courseId, lessonId),
    onSuccess: () => {
      toast.success("Lesson deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to delete lesson")
  });

  if (isLoadingCourse) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const course: Course = courseRes?.data;
  const quizzes: Quiz[] = quizzesRes?.data || [];
  const lessons = [...(course?.lessons || [])].sort((a, b) => a.order - b.order);

  if (!course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Course not found</h2>
        <Button onClick={() => router.push("/dashboard/admin/courses")}>Back to Courses</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/admin/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground text-sm">Course Management</p>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lessons">Lessons ({lessons.length})</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes ({quizzes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Title</Label>
                  <p className="font-medium">{course.title}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p className="font-medium">{course.isPublished ? "Published" : "Draft"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="font-medium">{course.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Price</Label>
                  <p className="font-medium">${course.price}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="font-medium mt-1">{course.shortDesc}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
              <CardTitle className="text-lg">Lessons</CardTitle>
              <Button onClick={() => {
                setEditingLesson(null);
                setIsLessonModalOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Add Lesson
              </Button>
            </CardHeader>
            <CardContent>
              {lessons.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <BookOpen className="h-10 w-10 mx-auto mb-4 opacity-50" />
                  <p>No lessons added yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                      <div>
                        <h4 className="font-medium">{idx + 1}. {lesson.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{lesson.content.substring(0, 100)}...</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditingLesson(lesson);
                          setIsLessonModalOpen(true);
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => {
                          if (confirm("Are you sure you want to delete this lesson?")) {
                            deleteLessonMutation.mutate(lesson.id);
                          }
                        }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
              <CardTitle className="text-lg">Quizzes</CardTitle>
              <Button onClick={() => setIsQuizModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Quiz
              </Button>
            </CardHeader>
            <CardContent>
              {quizzes.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <HelpCircle className="h-10 w-10 mx-auto mb-4 opacity-50" />
                  <p>No quizzes added yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                      <div>
                        <h4 className="font-medium">{quiz.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{quiz.questions.length} questions</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <LessonModal 
        isOpen={isLessonModalOpen} 
        onClose={() => setIsLessonModalOpen(false)} 
        courseId={courseId}
        lesson={editingLesson}
        order={lessons.length}
      />
      
      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        courseId={courseId}
        courseTitle={course?.title}
        firstLessonContent={course?.lessons?.[0]?.content}
      />
    </div>
  );
}

// Minimal Lesson Modal Implementation
function LessonModal({ isOpen, onClose, courseId, lesson, order }: any) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: lesson?.title || "",
    content: lesson?.content || "",
    videoUrl: lesson?.videoUrl || "",
    duration: lesson?.duration || 0,
    isPreview: lesson?.isPreview || false,
    order: lesson?.order ?? order,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: lesson?.title || "",
        content: lesson?.content || "",
        videoUrl: lesson?.videoUrl || "",
        duration: lesson?.duration || 0,
        isPreview: lesson?.isPreview || false,
        order: lesson?.order ?? order,
      });
    }
  }, [isOpen, lesson, order]);

  const mutation = useMutation({
    mutationFn: (data: any) => lesson 
      ? coursesApi.updateLesson(courseId, lesson.id, data)
      : coursesApi.addLesson(courseId, data),
    onSuccess: () => {
      toast.success(`Lesson ${lesson ? 'updated' : 'added'} successfully`);
      queryClient.invalidateQueries({ queryKey: ["admin-course", courseId] });
      onClose();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Action failed")
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{lesson ? 'Edit Lesson' : 'Add New Lesson'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              required 
              value={formData.title} 
              onChange={e => setFormData(p => ({...p, title: e.target.value}))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content (HTML allowed)</Label>
            <Textarea 
              id="content" 
              required 
              className="min-h-[150px]"
              value={formData.content} 
              onChange={e => setFormData(p => ({...p, content: e.target.value}))} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL (Optional)</Label>
            <Input 
              id="videoUrl" 
              value={formData.videoUrl} 
              onChange={e => setFormData(p => ({...p, videoUrl: e.target.value}))} 
            />
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {lesson ? 'Save Changes' : 'Add Lesson'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// AI Powered Quiz Modal Implementation
function QuizModal({ isOpen, onClose, courseId, courseTitle, firstLessonContent }: any) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"input" | "generating" | "review">("input");
  const [title, setTitle] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  
  const generateMutation = useMutation({
    mutationFn: () => aiApi.generateQuiz({ 
      courseTitle: courseTitle || "General Topic", 
      lessonContent: firstLessonContent || "Basic content", 
      numQuestions: 5 
    }).then(r => r.data),
    onMutate: () => setStep("generating"),
    onSuccess: (data) => {
      // Backend returns array of questions
      setGeneratedQuestions(data);
      setTitle(`Quiz: ${courseTitle}`);
      setStep("review");
      toast.success("AI successfully generated questions!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "AI Quiz generation failed");
      setStep("input");
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => quizApi.create(courseId, data),
    onSuccess: () => {
      toast.success("Quiz added successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-quizzes", courseId] });
      setStep("input");
      setTitle("");
      setGeneratedQuestions([]);
      onClose();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Action failed")
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateMutation.mutate();
  };

  const handleCreate = () => {
    createMutation.mutate({
      title,
      description: "Auto-generated AI Quiz",
      timeLimit: 15,
      questions: generatedQuestions.map((q, idx) => ({
        ...q,
        order: idx
      }))
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === "generating" ? <><Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" /> Generating Quiz...</> : "Add New Quiz"}
          </DialogTitle>
        </DialogHeader>

        {step === "input" && (
          <form onSubmit={handleGenerate} className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Our AI will analyze the course title and the first lesson content to generate 5 relevant multiple-choice questions automatically!
            </p>
            <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md">
              <Sparkles className="mr-2 h-4 w-4" /> Auto-Generate with AI
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiz-title">Manual Quiz Title</Label>
              <Input 
                id="quiz-title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Enter title and save empty quiz..."
              />
            </div>
            <Button type="button" variant="outline" className="w-full" onClick={() => {
              if(!title) return toast.error("Enter title");
              createMutation.mutate({ title, description: "", timeLimit: 10, questions: [] });
            }}>
              Create Empty Quiz
            </Button>
          </form>
        )}

        {step === "generating" && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
              <Loader2 className="h-12 w-12 text-indigo-500 animate-spin relative z-10" />
            </div>
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Reading lessons and crafting questions...</p>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Quiz Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="border border-border rounded-lg p-4 bg-muted/20 max-h-[40vh] overflow-y-auto space-y-4">
              {generatedQuestions.map((q, idx) => (
                <div key={idx} className="space-y-2 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                  <p className="font-medium text-sm">{idx + 1}. {q.text}</p>
                  <div className="pl-4 space-y-1">
                    {q.options?.map((opt: string, i: number) => (
                      <p key={i} className={cn("text-xs", q.answer === i ? "text-emerald-500 font-bold" : "text-muted-foreground")}>
                        {String.fromCharCode(65 + i)}. {opt}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save & Publish Quiz
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

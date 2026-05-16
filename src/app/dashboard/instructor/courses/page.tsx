"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi, aiApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { Search, Loader2, Edit, Trash2, Eye, EyeOff, Star, PlusCircle, Sparkles, BookOpen, Clock } from "lucide-react";
import { toast } from "sonner";
import { Course } from "@/types";
import { formatPrice, getLevelColor, cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

export default function InstructorCoursesPage() {
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["instructor-courses"],
    queryFn: () => coursesApi.getMyInstructorCourses().then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => coursesApi.update(id, data),
    onSuccess: () => { toast.success("Course updated"); queryClient.invalidateQueries({ queryKey: ["instructor-courses"] }); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => coursesApi.delete(id),
    onSuccess: () => { toast.success("Course deleted"); queryClient.invalidateQueries({ queryKey: ["instructor-courses"] }); },
  });

  const courses: Course[] = data?.data || [];
  
  // Filter locally since the endpoint might not support pagination/search natively yet
  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="text-muted-foreground text-sm mt-1">Create, manage, and publish your course content.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20 rounded-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Course
          </Button>
        </motion.div>
      </div>

      <Card className="border border-border shadow-sm bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50 border-border/50 focus-visible:ring-orange-500"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
      ) : filteredCourses.length === 0 ? (
        <Card className="border-dashed border-border/60 bg-transparent">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-10 w-10 text-orange-500/60" />
            </div>
            <h3 className="text-xl font-bold">No courses found</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">You haven't created any courses yet or none match your search criteria.</p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white">Create your first course</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all group flex flex-col h-full">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image src={course.thumbnail} alt={course.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={cn("backdrop-blur-md border-0 shadow-sm font-semibold", course.isPublished ? "bg-emerald-500/80 text-white" : "bg-black/50 text-white")}>
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-bold text-lg text-white line-clamp-1">{course.title}</h3>
                  </div>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col gap-4">
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline" className={cn("text-[10px] shadow-sm bg-background border-border/50 uppercase", getLevelColor(course.level))}>
                      {course.level}
                    </Badge>
                    <span className="font-bold text-orange-500">{formatPrice(course.price)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.shortDesc}</p>
                  
                  <div className="mt-auto grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {(course.lessons as any)?.length || 0} Lessons</div>
                    <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {course.duration || 0} mins</div>
                  </div>
                </CardContent>
                
                <div className="p-3 bg-muted/30 border-t border-border/50 flex gap-2">
                  <Button
                    variant="outline" size="sm" className="flex-1 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/30 dark:hover:text-orange-400 border-border/50"
                    title={course.isPublished ? "Unpublish" : "Publish"}
                    onClick={() => updateMutation.mutate({ id: course.id, data: { isPublished: !course.isPublished } })}
                  >
                    {course.isPublished ? <><EyeOff className="h-3.5 w-3.5 mr-2" /> Unpublish</> : <><Eye className="h-3.5 w-3.5 mr-2" /> Publish</>}
                  </Button>
                  <Button variant="default" size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" asChild>
                    <Link href={`/dashboard/admin/courses/${course.id}`}><Edit className="h-3.5 w-3.5 mr-2" /> Edit Details</Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <CreateCourseModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}

// Reuse the modal we created for Admin but style it slightly with Orange
function CreateCourseModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"input" | "generating" | "review">("input");
  
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [category, setCategory] = useState("Technology");
  
  const [description, setDescription] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [tags, setTags] = useState("");

  const resetState = () => {
    setStep("input");
    setTitle("");
    setLevel("BEGINNER");
    setCategory("Technology");
    setDescription("");
    setShortDesc("");
    setTags("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const generateMutation = useMutation({
    mutationFn: async () => {
      const [descRes, classRes] = await Promise.all([
        aiApi.generateDescription({ title, category, level, topics: [] }).then(r => r.data),
        aiApi.classifyContent({ title, description: title }).then(r => r.data)
      ]);
      return { desc: descRes.data, classification: classRes.data };
    },
    onMutate: () => setStep("generating"),
    onSuccess: (data) => {
      setDescription(data.desc?.description || data.desc || "Generated detailed description goes here.");
      setShortDesc(data.desc?.shortDesc || "Generated short description goes here.");
      if (data.classification?.category) setCategory(data.classification.category);
      if (data.classification?.tags) setTags(data.classification.tags.join(", "));
      
      setStep("review");
      toast.success("AI Generation Complete!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "AI Generation failed");
      setStep("input");
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => coursesApi.create(data),
    onSuccess: () => {
      toast.success("Course Created Successfully!");
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      handleClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create course");
    }
  });

  const handleGenerate = () => {
    if (!title.trim()) return toast.error("Please enter a course title.");
    generateMutation.mutate();
  };

  const handleCreate = () => {
    createMutation.mutate({
      title,
      description,
      shortDesc,
      category,
      level,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      price: 0, 
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop", 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] border-border shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === "input" && <><BookOpen className="h-5 w-5 text-orange-500" /> Create New Course</>}
            {step === "generating" && <><Sparkles className="h-5 w-5 text-orange-500 animate-pulse" /> AI is Crafting Your Course...</>}
            {step === "review" && <><Sparkles className="h-5 w-5 text-emerald-500" /> Review Generated Content</>}
          </DialogTitle>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground mb-4">Enter the basic details, and our AI will automatically generate a compelling course description and categorize it for you.</p>
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input id="title" placeholder="e.g. Master Advanced React Patterns" value={title} onChange={e => setTitle(e.target.value)} className="focus-visible:ring-orange-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category Concept</Label>
                <Input id="category" placeholder="e.g. Web Development" value={category} onChange={e => setCategory(e.target.value)} className="focus-visible:ring-orange-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Difficulty Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger id="level" className="focus-visible:ring-orange-500">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <Button onClick={handleGenerate} className="bg-gradient-to-r from-orange-400 to-rose-500 hover:from-orange-500 hover:to-rose-600 text-white shadow-lg shadow-orange-500/25">
                <Sparkles className="mr-2 h-4 w-4" /> Auto-Generate with AI
              </Button>
            </div>
          </div>
        )}

        {step === "generating" && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
              <Loader2 className="h-12 w-12 text-orange-500 animate-spin relative z-10" />
            </div>
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Analyzing topic, writing description, finding tags...</p>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="rev-title">Course Title</Label>
              <Input id="rev-title" value={title} onChange={e => setTitle(e.target.value)} className="focus-visible:ring-orange-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rev-short">Short Description (Summary)</Label>
              <Textarea id="rev-short" value={shortDesc} onChange={e => setShortDesc(e.target.value)} rows={2} className="focus-visible:ring-orange-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rev-desc">Full Description</Label>
              <Textarea id="rev-desc" value={description} onChange={e => setDescription(e.target.value)} className="min-h-[150px] focus-visible:ring-orange-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rev-cat">AI Selected Category</Label>
                <Input id="rev-cat" value={category} onChange={e => setCategory(e.target.value)} className="focus-visible:ring-orange-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rev-tags">AI Selected Tags</Label>
                <Input id="rev-tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="comma, separated, tags" className="focus-visible:ring-orange-500" />
              </div>
            </div>
            <div className="pt-4 flex justify-between">
              <Button variant="ghost" onClick={() => setStep("input")}>Back</Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending} className="bg-orange-600 hover:bg-orange-700 text-white">
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save & Create Course
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

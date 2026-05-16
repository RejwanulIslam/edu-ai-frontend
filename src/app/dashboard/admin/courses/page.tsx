"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi, aiApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { Search, Loader2, Trash2, Eye, EyeOff, Star, Plus, Sparkles, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Course } from "@/types";
import { formatPrice, getLevelColor, cn } from "@/lib/utils";
import Link from "next/link";

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-courses", search, page],
    queryFn: () => coursesApi.getAll({ search, page, limit: 10 }).then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => coursesApi.update(id, data),
    onSuccess: () => { toast.success("Course updated"); queryClient.invalidateQueries({ queryKey: ["admin-courses"] }); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => coursesApi.delete(id),
    onSuccess: () => { toast.success("Course deleted"); queryClient.invalidateQueries({ queryKey: ["admin-courses"] }); },
  });

  const courses: Course[] = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Courses</h1>
          <p className="text-muted-foreground text-sm mt-1">{pagination?.total || 0} total courses</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary text-primary-foreground shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Create Course
        </Button>
      </div>

      <Card className="border border-border shadow-sm">
        <CardContent className="p-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 bg-muted/40"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-lg font-bold">No courses found</h3>
              <p className="text-sm text-muted-foreground mb-4">You haven't created any courses yet or none match your search.</p>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>Create your first course</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                    <th className="text-left p-4 font-medium">Course</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Level</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Price</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Students</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-9 rounded overflow-hidden shrink-0 border border-border/50 shadow-sm">
                            <Image src={course.thumbnail} alt={course.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="min-w-0">
                            <Link href={`/dashboard/admin/courses/${course.id}`} className="font-medium text-sm truncate max-w-[200px] hover:text-primary transition-colors inline-block">
                              {course.title}
                            </Link>
                            <p className="text-xs text-muted-foreground">{course.instructor?.name || "No Instructor"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge variant="outline" className={cn("text-xs shadow-sm bg-background", getLevelColor(course.level))}>
                          {course.level}
                        </Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell font-medium text-sm">{formatPrice(course.price)}</td>
                      <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">{course.enrollmentCount || 0}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={cn("border-0 text-xs shadow-sm", course.isPublished ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400")}>
                          {course.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost" size="icon" className="h-8 w-8 hover:bg-background"
                            title={course.isPublished ? "Unpublish" : "Publish"}
                            onClick={() => updateMutation.mutate({ id: course.id, data: { isPublished: !course.isPublished } })}
                          >
                            {course.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost" size="icon" className="h-8 w-8 hover:bg-background"
                            title={course.isFeatured ? "Unfeature" : "Feature"}
                            onClick={() => updateMutation.mutate({ id: course.id, data: { isFeatured: !course.isFeatured } })}
                          >
                            <Star className={cn("h-4 w-4 transition-colors", course.isFeatured ? "fill-yellow-400 text-yellow-400" : "")} />
                          </Button>
                          <Button
                            variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 text-destructive"
                            onClick={() => { if (confirm("Delete this course?")) deleteMutation.mutate(course.id); }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
              <p className="text-xs text-muted-foreground font-medium">Page {pagination.page} of {pagination.totalPages}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)} className="shadow-sm">Previous</Button>
                <Button size="sm" variant="outline" disabled={page === pagination.totalPages} onClick={() => setPage(page + 1)} className="shadow-sm">Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateCourseModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}

function CreateCourseModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"input" | "generating" | "review">("input");
  
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [category, setCategory] = useState("Technology");
  
  // AI Generated fields
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
      // Run both AI calls concurrently
      const [descRes, classRes] = await Promise.all([
        aiApi.generateDescription({ title, category, level, topics: [] }).then(r => r.data),
        aiApi.classifyContent({ title, description: title }).then(r => r.data)
      ]);
      return { desc: descRes.data, classification: classRes.data };
    },
    onMutate: () => setStep("generating"),
    onSuccess: (data) => {
      // Assume backend returns description strings and category/tags
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
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
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
      price: 0, // default free until edited
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop", // placeholder
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] border-border shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === "input" && <><BookOpen className="h-5 w-5 text-primary" /> Create New Course</>}
            {step === "generating" && <><Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" /> AI is Crafting Your Course...</>}
            {step === "review" && <><Sparkles className="h-5 w-5 text-emerald-500" /> Review Generated Content</>}
          </DialogTitle>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground mb-4">Enter the basic details, and our AI will automatically generate a compelling course description and categorize it for you.</p>
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input id="title" placeholder="e.g. Master Advanced React Patterns" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category Concept</Label>
                <Input id="category" placeholder="e.g. Web Development" value={category} onChange={e => setCategory(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Difficulty Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger id="level">
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
              <Button onClick={handleGenerate} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="mr-2 h-4 w-4" /> Auto-Generate with AI
              </Button>
            </div>
          </div>
        )}

        {step === "generating" && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
              <Loader2 className="h-12 w-12 text-indigo-500 animate-spin relative z-10" />
            </div>
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Analyzing topic, writing description, finding tags...</p>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="rev-title">Course Title</Label>
              <Input id="rev-title" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rev-short">Short Description (Summary)</Label>
              <Textarea id="rev-short" value={shortDesc} onChange={e => setShortDesc(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rev-desc">Full Description</Label>
              <Textarea id="rev-desc" value={description} onChange={e => setDescription(e.target.value)} className="min-h-[150px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rev-cat">AI Selected Category</Label>
                <Input id="rev-cat" value={category} onChange={e => setCategory(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rev-tags">AI Selected Tags</Label>
                <Input id="rev-tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="comma, separated, tags" />
              </div>
            </div>
            <div className="pt-4 flex justify-between">
              <Button variant="ghost" onClick={() => setStep("input")}>Back</Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
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

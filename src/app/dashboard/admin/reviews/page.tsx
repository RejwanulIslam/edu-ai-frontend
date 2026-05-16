"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi, reviewsApi } from "@/lib/api";
import { Course, Review } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");

  const { data: coursesRes, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: () => coursesApi.getAll({ limit: 100 }).then((r) => r.data),
  });

  const { data: reviewsRes, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["admin-reviews", selectedCourseId],
    queryFn: () => reviewsApi.getCourseReviews(selectedCourseId).then((r) => r.data),
    enabled: selectedCourseId !== "all" && selectedCourseId !== "",
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) => reviewsApi.delete(reviewId),
    onSuccess: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews", selectedCourseId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete review");
    }
  });

  const courses: Course[] = coursesRes?.data || [];
  const reviews: Review[] = reviewsRes?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Review Management</h1>
          <p className="text-muted-foreground text-sm">Moderate user reviews across courses</p>
        </div>
        
        <div className="w-full sm:w-64">
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a course..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" disabled>Select a course...</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> 
            {selectedCourseId === "all" ? "Select a course to view reviews" : `Reviews (${reviews.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedCourseId === "all" ? (
            <div className="text-center py-16 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Please select a course from the dropdown above to manage its reviews.</p>
            </div>
          ) : isLoadingReviews ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>No reviews found for this course.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 rounded-lg border border-border bg-card flex flex-col sm:flex-row gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.user.image || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {review.user.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{review.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3.5 w-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground opacity-30"}`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-foreground">{review.comment}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end sm:justify-start">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this review?")) {
                          deleteReviewMutation.mutate(review.id);
                        }
                      }}
                      disabled={deleteReviewMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

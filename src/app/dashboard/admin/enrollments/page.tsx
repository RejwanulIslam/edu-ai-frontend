"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { enrollmentsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api";

export default function AdminEnrollmentsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-enrollments", page],
    queryFn: () =>
      api.get("/api/enrollments/admin/all", { params: { page, limit: 10 } }).then((r) => r.data),
  });

  const enrollments = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Enrollments</h1>
        <p className="text-muted-foreground text-sm mt-1">{pagination?.total || 0} total enrollments</p>
      </div>

      <Card className="border border-border">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-medium text-muted-foreground">Student</th>
                    <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Course</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Progress</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Enrolled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {enrollments.map((enrollment: any) => (
                    <tr key={enrollment.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={enrollment.user?.image || ""} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">{enrollment.user?.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[120px]">{enrollment.user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[120px]">{enrollment.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="text-sm truncate max-w-[180px]">{enrollment.course?.title}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <Progress value={enrollment.progress || 0} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground">{Math.round(enrollment.progress || 0)}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={
                          enrollment.status === "COMPLETED"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0"
                            : enrollment.status === "CANCELLED"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0"
                        }>
                          {enrollment.status}
                        </Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell text-xs text-muted-foreground">
                        {format(new Date(enrollment.createdAt), "MMM d, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-xs text-muted-foreground">Page {pagination.page} of {pagination.totalPages}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button size="sm" variant="outline" disabled={page === pagination.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

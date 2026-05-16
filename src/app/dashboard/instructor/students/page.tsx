"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, MoreHorizontal, GraduationCap, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock Data
const MOCK_STUDENTS = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", avatar: "https://i.pravatar.cc/150?u=1", course: "Advanced React Patterns", progress: 75, enrolledAt: "2024-03-12" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", avatar: "https://i.pravatar.cc/150?u=2", course: "Advanced React Patterns", progress: 100, enrolledAt: "2024-02-28" },
  { id: 3, name: "Charlie Davis", email: "charlie@example.com", avatar: "https://i.pravatar.cc/150?u=3", course: "Next.js Fullstack", progress: 30, enrolledAt: "2024-04-01" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", avatar: "https://i.pravatar.cc/150?u=4", course: "Next.js Fullstack", progress: 0, enrolledAt: "2024-04-10" },
  { id: 5, name: "Evan Wright", email: "evan@example.com", avatar: "https://i.pravatar.cc/150?u=5", course: "TypeScript for Beginners", progress: 55, enrolledAt: "2024-03-20" },
  { id: 6, name: "Fiona Gallagher", email: "fiona@example.com", avatar: "https://i.pravatar.cc/150?u=6", course: "Advanced React Patterns", progress: 85, enrolledAt: "2024-03-15" },
];

export default function InstructorStudentsPage() {
  const [search, setSearch] = useState("");

  const filteredStudents = MOCK_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-bold">Students Hub</h1>
          <p className="text-muted-foreground text-sm mt-1">Track progress and engagement across all your courses.</p>
        </motion.div>
      </div>

      <Card className="border border-border shadow-sm bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50 border-border/50 focus-visible:ring-orange-500"
            />
          </div>
          <Button variant="outline" className="shrink-0 border-border/50">
            Export CSV
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredStudents.map((student, idx) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm hover:bg-muted/20 transition-colors shadow-sm group">
              <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                
                {/* User Info */}
                <div className="flex items-center gap-4 min-w-[250px]">
                  <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback className="bg-orange-500/10 text-orange-500 font-bold">
                      {student.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-sm">{student.name}</h3>
                    <p className="text-xs text-muted-foreground">{student.email}</p>
                  </div>
                </div>

                {/* Course Details */}
                <div className="flex-1 min-w-[200px]">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Enrolled In</p>
                  <p className="text-sm font-medium flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-orange-500" />
                    {student.course}
                  </p>
                </div>

                {/* Progress */}
                <div className="w-full md:w-48">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium">Course Progress</span>
                    <span className={cn("font-bold", student.progress === 100 ? "text-emerald-500" : "text-muted-foreground")}>
                      {student.progress}%
                    </span>
                  </div>
                  <Progress 
                    value={student.progress} 
                    className="h-2 bg-muted" 
                    indicatorClassName={student.progress === 100 ? "bg-emerald-500" : "bg-orange-500"}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-auto w-full md:w-auto justify-end">
                  <div className="text-right mr-4 hidden xl:block">
                    <p className="text-xs text-muted-foreground mb-0.5">Enrolled</p>
                    <p className="text-xs font-medium flex items-center gap-1"><Clock className="h-3 w-3" /> {student.enrolledAt}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted/50">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

              </CardContent>
            </Card>
          </motion.div>
        ))}
        {filteredStudents.length === 0 && (
          <div className="text-center py-20">
            <GraduationCap className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No students found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

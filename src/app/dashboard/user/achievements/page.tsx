"use client";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Zap, BookOpen, MessageSquare, Target, Lock } from "lucide-react";
import { motion } from "framer-motion";

const achievements = [
  { id: 1, icon: BookOpen, title: "First Steps", desc: "Enroll in your first course", earned: true, color: "text-green-500 bg-green-100 dark:bg-green-900/30" },
  { id: 2, icon: Star, title: "Quick Learner", desc: "Complete a course in under 7 days", earned: true, color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30" },
  { id: 3, icon: MessageSquare, title: "AI Explorer", desc: "Send 10 messages to the AI assistant", earned: true, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30" },
  { id: 4, icon: Zap, title: "Quiz Master", desc: "Score 100% on any quiz", earned: false, color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30" },
  { id: 5, icon: Target, title: "Dedicated Learner", desc: "Maintain a 7-day learning streak", earned: false, color: "text-orange-500 bg-orange-100 dark:bg-orange-900/30" },
  { id: 6, icon: Trophy, title: "Course Champion", desc: "Complete 5 courses", earned: false, color: "text-red-500 bg-red-100 dark:bg-red-900/30" },
];

export default function AchievementsPage() {
  const earned = achievements.filter((a) => a.earned).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Achievements</h1>
        <p className="text-muted-foreground text-sm mt-1">{earned} of {achievements.length} earned</p>
      </div>

      <Card className="border border-border">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{earned}/{achievements.length}</span>
          </div>
          <Progress value={(earned / achievements.length) * 100} className="h-2.5" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, i) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card className={`border transition-all duration-300 ${achievement.earned ? "border-border hover:shadow-md" : "border-border opacity-60"}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${achievement.earned ? achievement.color : "bg-muted text-muted-foreground"}`}>
                    {achievement.earned ? (
                      <achievement.icon className="h-6 w-6" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{achievement.title}</h3>
                      {achievement.earned && (
                        <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 px-1.5 py-0">Earned</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Users, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Course } from "@/types";
import { formatPrice, formatDuration, getLevelColor, cn } from "@/lib/utils";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="group overflow-hidden border border-border card-hover h-full flex flex-col">
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video">
        <Image
          src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute top-3 left-3">
          <Badge className={cn("text-xs font-medium border-0", getLevelColor(course.level))}>
            {course.level}
          </Badge>
        </div>
        {course.price === 0 && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500 text-white text-xs border-0">FREE</Badge>
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-4">
        {/* Category */}
        <p className="text-xs text-primary font-medium mb-1.5">{course.category}</p>

        {/* Title */}
        <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Short Desc */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{course.shortDesc}</p>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-5 w-5">
            <AvatarImage src={course.instructor?.image || ""} />
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {course.instructor?.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">{course.instructor?.name}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{course.rating.toFixed(1)}</span>
            <span>({course.totalRatings})</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{course.totalStudents.toLocaleString()}</span>
          </div>
          {course.duration > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(course.duration)}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className={cn("text-lg font-bold", course.price === 0 ? "text-green-600" : "text-foreground")}>
          {formatPrice(course.price)}
        </span>
        <Button size="sm" asChild className="text-xs">
          <Link href={`/courses/${course.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Skeleton loader
export function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <div className="aspect-video shimmer-bg" />
      <CardContent className="p-4 space-y-3">
        <div className="h-3 w-20 shimmer-bg rounded" />
        <div className="h-4 w-full shimmer-bg rounded" />
        <div className="h-4 w-3/4 shimmer-bg rounded" />
        <div className="h-3 w-full shimmer-bg rounded" />
        <div className="h-3 w-1/2 shimmer-bg rounded" />
        <div className="flex gap-3">
          <div className="h-3 w-16 shimmer-bg rounded" />
          <div className="h-3 w-16 shimmer-bg rounded" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="h-6 w-16 shimmer-bg rounded" />
        <div className="h-8 w-24 shimmer-bg rounded" />
      </CardFooter>
    </Card>
  );
}

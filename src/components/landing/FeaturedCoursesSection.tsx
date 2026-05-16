import { CourseCard } from "@/components/shared/CourseCard";
import { Course } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

async function getFeaturedCourses(): Promise<Course[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/courses/featured`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function FeaturedCoursesSection() {
  const courses = await getFeaturedCourses();

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary font-medium text-sm mb-2">Top Picks</p>
            <h2 className="text-3xl md:text-4xl font-bold">Featured Courses</h2>
          </div>
          <Link
            href="/courses"
            className="hidden md:flex items-center gap-1 text-sm text-primary hover:underline font-medium"
          >
            View all courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No featured courses yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/courses" className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1">
            View all courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

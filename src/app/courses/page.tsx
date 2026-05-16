"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { CourseCard, CourseCardSkeleton } from "@/components/shared/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { coursesApi } from "@/lib/api";
import { Course } from "@/types";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";

const LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const CATEGORIES = ["Web Development", "Data Science", "Design", "Business", "Language", "Music", "Photography", "Science"];
const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <CourseCardSkeleton key={i} />)}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <CoursesContent />
    </Suspense>
  );
}

function CoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [level, setLevel] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ["courses", debouncedSearch, category, level, sortBy, page],
    queryFn: () => coursesApi.getAll({ search: debouncedSearch, category, level, sortBy, page, limit: 12 })
      .then((r) => r.data),
  });

  const courses: Course[] = data?.data || [];
  const pagination = data?.pagination;

  const clearFilters = useCallback(() => {
    setSearch(""); setCategory(""); setLevel(""); setSortBy("newest"); setPage(1);
  }, []);

  const hasFilters = search || category || level || sortBy !== "newest";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Header */}
        <div className="bg-muted/30 border-b border-border py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Explore Courses</h1>
            <p className="text-muted-foreground">
              Discover {pagination?.total || "hundreds of"} courses taught by expert instructors
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 h-10"
              />
            </div>

            {/* Category */}
            <Select value={category || "all"} onValueChange={(v) => { setCategory(v === "all" ? "" : v); setPage(1); }}>
              <SelectTrigger className="w-full lg:w-48 h-10">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Level */}
            <Select value={level || "all"} onValueChange={(v) => { setLevel(v === "all" ? "" : v); setPage(1); }}>
              <SelectTrigger className="w-full lg:w-40 h-10">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
              <SelectTrigger className="w-full lg:w-48 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 h-10 text-muted-foreground">
                <X className="h-4 w-4" /> Clear
              </Button>
            )}
          </div>

          {/* Active filters */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {search && <Badge variant="secondary" className="gap-1">Search: {search} <X className="h-3 w-3 cursor-pointer" onClick={() => setSearch("")} /></Badge>}
              {category && <Badge variant="secondary" className="gap-1">{category} <X className="h-3 w-3 cursor-pointer" onClick={() => setCategory("")} /></Badge>}
              {level && <Badge variant="secondary" className="gap-1">{level} <X className="h-3 w-3 cursor-pointer" onClick={() => setLevel("")} /></Badge>}
            </div>
          )}

          {/* Results count */}
          {!isLoading && (
            <p className="text-sm text-muted-foreground mb-6">
              {pagination?.total || 0} course{pagination?.total !== 1 ? "s" : ""} found
            </p>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <CourseCardSkeleton key={i} />)}
            </div>
          ) : courses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <SlidersHorizontal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
              <Button onClick={clearFilters} variant="outline">Clear All Filters</Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                const p = i + 1;
                return (
                  <Button
                    key={p}
                    size="sm"
                    variant={page === p ? "default" : "outline"}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                disabled={page === pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

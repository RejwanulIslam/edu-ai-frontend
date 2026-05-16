export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  thumbnail: string;
  price: number;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  category: string;
  tags: string[];
  language: string;
  duration: number;
  isPublished: boolean;
  isFeatured: boolean;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  createdAt: string;
  instructor: {
    id: string;
    name: string;
    image?: string | null;
    bio?: string | null;
  };
  lessons?: Lesson[];
  _count?: {
    enrollments: number;
    lessons: number;
    reviews?: number;
  };
  isEnrolled?: boolean;
  enrollmentCount?: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string | null;
  duration: number;
  order: number;
  isPreview: boolean;
  courseId: string;
}

export interface Enrollment {
  id: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  progress: number;
  completedAt?: string | null;
  createdAt: string;
  course: Course;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string | null;
  };
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  timeLimit?: number;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  answer: number;
  explanation?: string;
  order: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ChatMessage {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

export interface Category {
  name: string;
  count: number;
}

import axios from "axios";

const api = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      // Don't redirect on auth/session endpoints — those 401s are expected
      // when the user is not logged in yet
      const isAuthEndpoint = url.includes("/api/auth") || url.includes("/api/auth-extra");
      if (typeof window !== "undefined" && !isAuthEndpoint) {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Typed API methods
export const authApi = {
  getMe: () => api.get("/api/auth-extra/me"),
  getSession: () => api.get("/api/auth-extra/session"),
  getDemoCredentials: () => api.get("/api/auth-extra/demo-credentials"),
  seedDemo: () => api.post("/api/auth-extra/seed-demo"),
  updateRole: (role: string) => api.patch("/api/auth-extra/update-role", { role }),
};

export const coursesApi = {
  getAll: (params?: Record<string, any>) => api.get("/api/courses", { params }),
  getFeatured: () => api.get("/api/courses/featured"),
  getCategories: () => api.get("/api/courses/categories"),
  getStats: () => api.get("/api/courses/stats"),
  getBySlug: (slug: string) => api.get(`/api/courses/slug/${slug}`),
  getById: (id: string) => api.get(`/api/courses/${id}`),
  create: (data: any) => api.post("/api/courses", data),
  update: (id: string, data: any) => api.put(`/api/courses/${id}`, data),
  delete: (id: string) => api.delete(`/api/courses/${id}`),
  getMyInstructorCourses: () => api.get("/api/courses/my/instructor"),
  addLesson: (courseId: string, data: any) => api.post(`/api/courses/${courseId}/lessons`, data),
  updateLesson: (courseId: string, lessonId: string, data: any) => api.put(`/api/courses/${courseId}/lessons/${lessonId}`, data),
  deleteLesson: (courseId: string, lessonId: string) => api.delete(`/api/courses/${courseId}/lessons/${lessonId}`),
};

export const enrollmentsApi = {
  enroll: (courseId: string) => api.post(`/api/enrollments/${courseId}`),
  unenroll: (courseId: string) => api.delete(`/api/enrollments/${courseId}`),
  getMyEnrollments: () => api.get("/api/enrollments/my/all"),
  updateProgress: (courseId: string, progress: number) =>
    api.patch(`/api/enrollments/${courseId}/progress`, { progress }),
};

export const reviewsApi = {
  getCourseReviews: (courseId: string) => api.get(`/api/reviews/${courseId}`),
  create: (courseId: string, data: any) => api.post(`/api/reviews/${courseId}`, data),
  update: (reviewId: string, data: any) => api.put(`/api/reviews/${reviewId}`, data),
  delete: (reviewId: string) => api.delete(`/api/reviews/${reviewId}`),
};

export const usersApi = {
  getProfile: () => api.get("/api/users/profile"),
  updateProfile: (data: any) => api.put("/api/users/profile", data),
  getAdminStats: () => api.get("/api/users/admin/stats"),
  getAllUsers: (params?: any) => api.get("/api/users/admin/all", { params }),
  updateRole: (id: string, role: string) => api.put(`/api/users/admin/${id}/role`, { role }),
  toggleStatus: (id: string) => api.patch(`/api/users/admin/${id}/toggle`),
  getDashboardStats: () => api.get("/api/users/dashboard-stats"),
};

export const aiApi = {
  generateDescription: (data: any) => api.post("/api/ai/generate-description", data),
  generateQuiz: (data: any) => api.post("/api/ai/generate-quiz", data),
  getRecommendations: () => api.get("/api/ai/recommendations"),
  chat: (data: { message: string; sessionId?: string }) => api.post("/api/ai/chat", data),
  classifyContent: (data: any) => api.post("/api/ai/classify", data),
  getChatHistory: (sessionId: string) => api.get(`/api/ai/chat/${sessionId}`),
  getChatSessions: () => api.get("/api/ai/chat/sessions"),
};

export const quizApi = {
  getByCourse: (courseId: string) => api.get(`/api/quiz/course/${courseId}`),
  create: (courseId: string, data: any) => api.post(`/api/quiz/course/${courseId}`, data),
  submitAttempt: (quizId: string, answers: number[]) => api.post(`/api/quiz/${quizId}/attempt`, { answers }),
  getMyAttempts: (quizId: string) => api.get(`/api/quiz/${quizId}/my-attempts`),
};

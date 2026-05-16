import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

/**
 * Maps a user role to its corresponding dashboard path.
 * Single source of truth — update here to affect all redirect logic.
 */
export function getDashboardPath(role: UserRole | string | undefined): string {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "INSTRUCTOR":
      return "/dashboard/instructor";
    case "STUDENT":
    default:
      return "/dashboard/user";
  }
}

/**
 * Redirects the user to the correct dashboard based on their role.
 * Call this after a successful login or session check.
 *
 * @param role   - The user's role from the DB (STUDENT | INSTRUCTOR | ADMIN)
 * @param router - Next.js App Router instance
 */
export function redirectByRole(
  role: UserRole | string | undefined,
  router: AppRouterInstance
): void {
  const path = getDashboardPath(role);
  router.push(path);
  router.refresh();
}

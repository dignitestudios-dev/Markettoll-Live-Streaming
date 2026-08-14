// ─────────────────────────────────────────────────────────────────────────────
// Route Configuration
//
// This is the single source of truth for all route-related constants.
// The proxy.ts (middleware) imports from here to make auth decisions.
//
// Things that belong in this file:
//   • PUBLIC_ROUTES     — pages accessible without authentication
//   • PROTECTED_ROUTES  — pages that require a valid auth token
//   • AUTH_REDIRECT     — where to send unauthenticated users
//   • DEFAULT_REDIRECT  — where to send already-authenticated users
//   • API_ROUTES        — route prefixes for internal Next.js API handlers (if added)
//   • ROLE_ROUTES       — route-to-role mappings for RBAC (e.g. /admin → ["admin"])
//   • ONBOARDING_ROUTE  — redirect target for users who haven't completed setup
//   • MAINTENANCE_ROUTE — static page to show during downtime
// ─────────────────────────────────────────────────────────────────────────────

export const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register"];

export const AUTH_ROUTES = ["/auth/login", "/auth/register", "/login"];

export const PROTECTED_ROUTES = [
  "/dashboard",
  "/account",
  "/settings",
  "/live-stream",
  "/create-live-stream",
  "/pre-live-setup",
  "/pre-stream-setup",
];

// Where unauthenticated users are redirected when they hit a protected route
export const AUTH_REDIRECT = "/auth/login";

// Where authenticated users are redirected when they try to access auth pages
export const DEFAULT_REDIRECT = "/";


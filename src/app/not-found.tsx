import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          404
        </span>
        <h1 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">
          Page not found
        </h1>
        <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>

      <Link
        href="/dashboard"
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Back to dashboard
      </Link>
    </div>
  );
}

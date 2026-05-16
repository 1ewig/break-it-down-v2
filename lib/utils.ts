import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns the site URL for redirects.
 * Priorities: 
 * 1. window.location.origin (if in browser)
 * 2. NEXT_PUBLIC_SITE_URL (manual env var)
 * 3. NEXT_PUBLIC_VERCEL_URL (auto env var)
 * 4. http://localhost:3000 (fallback)
 */
export function getURL() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000';

  // Ensure https if not localhost
  url = url.startsWith('http') ? url : `https://${url}`;
  // Remove trailing slash if present for consistency
  url = url.endsWith('/') ? url.slice(0, -1) : url;
  
  return url;
}

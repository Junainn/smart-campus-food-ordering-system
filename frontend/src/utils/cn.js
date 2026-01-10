import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes with tailwind-merge to handle conflicts
 * Example: cn('px-2 py-1', condition && 'px-4') => 'py-1 px-4' (px-4 overrides px-2)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

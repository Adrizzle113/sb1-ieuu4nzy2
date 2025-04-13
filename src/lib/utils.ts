import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Creates a date object set to midnight in local timezone
 */
export function createLocalMidnight(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * Converts a date string from the database to a JavaScript Date object
 * Ensures consistent timezone handling by using local midnight
 */
export function parseDBDate(dateString: string): Date {
  if (!dateString) return new Date();
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Formats a Date object for database storage
 * Uses local date components to avoid timezone issues
 */
export function formatDBDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a date for display in the user's local timezone
 */
export function formatDisplayDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = parseDBDate(date);
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getVideoId(url: string): { type: 'youtube' | 'vimeo' | null; id: string | null } {
  // YouTube URL patterns
  const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  
  if (youtubeMatch) {
    return { type: 'youtube', id: youtubeMatch[1] };
  }

  // Vimeo URL patterns
  const vimeoRegex = /^(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  
  if (vimeoMatch) {
    return { type: 'vimeo', id: vimeoMatch[1] };
  }

  return { type: null, id: null };
}

export function getEmbedUrl(type: 'youtube' | 'vimeo', id: string): string {
  switch (type) {
    case 'youtube':
      return `https://www.youtube.com/embed/${id}`;
    case 'vimeo':
      return `https://player.vimeo.com/video/${id}`;
    default:
      return '';
  }
}
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { format, isToday, isYesterday, subDays, startOfDay, isWithinInterval } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitial(name: string) {
  return Array.from(name)[0]
}

export function formatDate(dateTime: Date | string) {
  const date = new Date(dateTime)
  const now = new Date()

  if (isToday(date)) {
    return `Today at ${format(date, "HH:mm")}`
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, "HH:mm")}`
  }

  const startOfThisWeek = startOfDay(subDays(now, now.getDay()))
  if (isWithinInterval(date, { start: startOfThisWeek, end: now })) {
    return `Last ${format(date, 'EEEE')} at ${format(date, 'HH:mm')}`
  }

  if (date < subDays(now, 14)) {
    return format(date, 'eeee dd/MM');
  }

  return format(date, 'HH:mm');
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

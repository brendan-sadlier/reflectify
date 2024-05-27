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

export function getEmotionColors(emotion: string) {
  switch (emotion.toLowerCase()) {
    case "happy":
      return "bg-green-500 text-white"
    case "excited":
      return "bg-yellow-500 text-black"
    case "calm":
      return "bg-blue-500 text-white"
    case "content":
      return "bg-green-500 text-white"
    case "sad":
      return "bg-blue-500 text-white"
    case "anxious":
      return "bg-yellow-500 text-black"
    case "stressed":
      return "bg-red-500 text-white"
    case "frustrated":
      return "bg-red-500 text-white"
    case "angry":
      return "bg-red-500 text-white"
    case "tired":
      return "bg-gray-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

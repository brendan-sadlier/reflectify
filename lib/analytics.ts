import { endOfWeek, startOfWeek, subWeeks } from "date-fns";
import prisma from "./db";
import { unstable_noStore as noStore } from "next/cache";

type EntryType = "moodEntry" | "journalEntry";

// Define an interface for Prisma to ensure type safety
interface PrismaClient {
  moodEntry: { count: (args: any) => Promise<number> };
  journalEntry: { count: (args: any) => Promise<number> };
}

const prismaClient = prisma as PrismaClient;

async function countEntries(entryType: EntryType, userId: string) {
  noStore();
  const totalCount = await prismaClient[entryType].count({
    where: {
      userId: userId,
    }
  });

  return totalCount;
}

async function calculatePercentageIncrease(entryType: EntryType, userId: string) {

  noStore();

  const { startOfCurrentWeek, endOfCurrentWeek, startOfLastWeek, endOfLastWeek } = getWeekBoundaries();

  const currentWeekCount = await prismaClient[entryType].count({
    where: {
      userId: userId,
      createdAt: {
        gte: startOfCurrentWeek,
        lt: endOfCurrentWeek,
      }
    }
  });

  const lastWeekCount = await prismaClient[entryType].count({
    where: {
      userId: userId,
      createdAt: {
        gte: startOfLastWeek,
        lt: endOfLastWeek,
      }
    }
  });

  let percentageIncrease = 0;
  if (lastWeekCount > 0) {
    percentageIncrease = ((currentWeekCount - lastWeekCount) / lastWeekCount) * 100;
  } else if (currentWeekCount > 0) {
    percentageIncrease = currentWeekCount * 100;
  }

  return percentageIncrease;
}

function getWeekBoundaries() {
  const now = new Date();
  const startOfCurrentWeek = startOfWeek(now)
  const endOfCurrentWeek = endOfWeek(now);
  const startOfLastWeek = subWeeks(startOfCurrentWeek, 1);
  const endOfLastWeek = subWeeks(endOfCurrentWeek, 1);

  return {
    startOfCurrentWeek,
    endOfCurrentWeek,
    startOfLastWeek,
    endOfLastWeek,
  };
}

export async function totalMoodCount(userId: string): Promise<number> {
  return await countEntries('moodEntry', userId);
}

export async function totalJournalCount(userId: string): Promise<number> {
  return await countEntries('journalEntry', userId);
}

export async function percentageIncreaseInMoodCount(userId: string): Promise<number> {
  return await calculatePercentageIncrease('moodEntry', userId);
}

export async function percentageIncreaseInJournalCount(userId: string): Promise<number> {
  return await calculatePercentageIncrease('journalEntry', userId);
}
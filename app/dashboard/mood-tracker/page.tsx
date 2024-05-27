import MoodInput from "@/app/components/MoodInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";
import { formatDate, getEmotionColors, toTitleCase } from "@/lib/utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Brain } from "lucide-react";

async function getMoodEntries(userId: string) {
  const data = await prisma.moodEntry.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      createdAt: 'desc'
    },
  });

  return data;
}

export default async function MoodPage() {

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userMoodEntries = await getMoodEntries(user?.id as string);


  return (
    <div className="grid items-start gap-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl font-semibold">Mood Tracker</h1>
        </div>
      </div>
  
      <MoodInput />

      <h2 className="text-xl md:text-2xl font-medium">Your Moods</h2>
      { userMoodEntries.length < 1 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border-dashed p-8 text-center animate-in fade-in-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Brain className="w-10 h-10 text-primary" />
          </div>
          <h1 className="mt-6 text-xl font-semibold">No Moods so far...</h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 md:gap-4">

          {userMoodEntries.map((mood) => (
            <Card key={mood.id} className="xl:col-span-1">

              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-1">
                  <CardTitle className="text-lg">{toTitleCase(mood.mood)}</CardTitle>
                  <CardDescription>{formatDate(mood.createdAt)}</CardDescription>
                </div>

              </CardHeader>

              <CardContent>
                  
                <p>
                  {mood.body}
                </p>

              </CardContent>

            </Card>
          ))}

        </div>
      )}
  
    {/* {userJournalEntries.length < 1 ? (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border-dashed p-8 text-center animate-in fade-in-50">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Notebook className="w-10 h-10 text-primary" />
        </div>
        <h1 className="mt-6 text-xl font-semibold">No Journal Entries so far...</h1>
        <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">Click &quot;New Journal Entry&quot; to get started</p>
      </div>
    ) : (
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
  
        {userJournalEntries.map((entry) => (
          <Card key={entry.id} className="xl:col-span-2">
  
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle className="text-lg">{entry.title}</CardTitle>
                <CardDescription>{formatDate(entry.createdAt)}</CardDescription>
              </div>
  
              <Button asChild size="icon" className="ml-auto gap-1 mr-2">
  
                <Link href={`/dashboard/new-journal-entry/${entry.id}`}>
                  <Button size="icon">
                    <Pencil className="w-4 h-4"/>
                  </Button>
                </Link>
  
              </Button>
  
              <form action={deleteJournalEntry}>
                  <input type="hidden" name="journalEntryId" value={entry.id} />
                  <DeleteEntryButton />
              </form>
  
            </CardHeader>
  
            <CardContent>
                
              <p>
                {entry.body}
              </p>
  
            </CardContent>
  
          </Card>
        ))}
  
      </div>
    )} */}
  
    </div>
  )
}
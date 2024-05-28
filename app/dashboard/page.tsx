import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { percentageIncreaseInJournalCount, percentageIncreaseInMoodCount, totalJournalCount, totalMoodCount } from "@/lib/analytics";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Brain, Notebook } from "lucide-react";

export default async function Dashboard() {

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const moodCount = await totalMoodCount(user?.id as string);
  const journalCount = await totalJournalCount(user?.id as string);

  const percentageMoodCountIncrease = await percentageIncreaseInMoodCount(user?.id as string);
  const percentageJournalCountIncrease = await percentageIncreaseInJournalCount(user?.id as string);

  return (

    <div className="grid gap-2 md:grid-cols-2 md:gap-8 lg:grid-cols-2">

      <h1 className="font-bold col-span-2">Quick Actions</h1>

      <Button className="col-span-1">Log a Mood</Button>
      <Button className="w-full">Write a Journal Entry</Button>

      <h1 className="col-span-2">Stats</h1>

      <Card>

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Moods Logged
          </CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">
            {moodCount}
          </div>

          <div className="text-sm text-muted-foreground">
            {percentageMoodCountIncrease}% increase from last week
          </div>
        </CardContent>

      </Card>

      <Card>

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Journal Entries
          </CardTitle>
          <Notebook className="h-4 w-4 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">
            {journalCount}
          </div>

          <div className="text-sm text-muted-foreground">
            {percentageJournalCountIncrease}% increase from last week
          </div>
        </CardContent>

      </Card>

    </div>
  );
}
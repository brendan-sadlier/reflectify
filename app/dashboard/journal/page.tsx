import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { Delete, Edit, Notebook, NotebookIcon, NotebookPenIcon, Pencil, Trash, Trash2 } from "lucide-react";
import Link from "next/link";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

import { DeleteEntryButton } from "@/app/components/SubmitButton";

async function getJournalEntries(userId: string) {
  noStore();
  const data = await prisma.journalEntry.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      createdAt: 'desc'
    },
  });

  return data;
}

export default async function JournalPage() {

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userJournalEntries = await getJournalEntries(user?.id as string);

  async function deleteJournalEntry(formData: FormData) {
    "use server"

    const journalEntryId = formData.get("journalEntryId") as string;

    await prisma.journalEntry.delete({
      where: {
        id: journalEntryId
      }
    })

    revalidatePath('/dashboard/journal')
  }

  return (
    <div className="grid items-start gap-y-8">

      <div className="flex items-center justify-between px-2">

        <div className="grid gap-1">

          <h1 className="text-3xl md:text-4xl font-semibold">Your Journal Entries</h1>

        </div>

        <Button asChild>
          <Link href="/dashboard/new-journal-entry">
            <NotebookPenIcon className="w-4 h-4 mr-2" />
              New Journal Entry
          </Link>
        </Button>

      </div>

      {userJournalEntries.length < 1 ? (
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
      )}

    </div>
  )

}
import { SubmitButton } from "@/app/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

import { unstable_noStore as noStore } from "next/cache";

async function getJournalEntry({ userId, journalEntryId }: { userId: string, journalEntryId: string }) {
  noStore();
  const data = await prisma.journalEntry.findUnique({
    where: {
      id: journalEntryId,
      userId: userId
    },
    select: {
      title: true,
      body: true,
      id: true
    }
  });

  return data;
}

export default async function DynamicJournalEntryPage({ params, } : { params: { id: string }; }) {

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const journalEntryData = await getJournalEntry({userId: user?.id as string, journalEntryId: params.id});

  async function updateJournalEntry(formData: FormData) {
    "use server"

    if (!user) {
      throw new Error("Not Authenticated")
    }

    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    await prisma.journalEntry.update({
      where: {
        id: journalEntryData?.id as string,
        userId: user.id
      },
      data: {
        title: title,
        body: body
      }
    })

    revalidatePath('/dashboard/journal')

    return redirect("/dashboard/journal")
  }

  return (
    <Card>
      <form action={updateJournalEntry}>
        <CardHeader>
          <CardTitle>Edit Journal Entry</CardTitle>
          <CardDescription>Record your thoughts and feelings</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-y-5">

          <div className="gap-y-2 flex flex-col">
            <Label>Title</Label>
            <Input 
              required 
              name="title" 
              type="text" 
              placeholder="Enter a title for your journal entry" 
              defaultValue={journalEntryData?.title}
            />
          </div>

          <div className="flex flex-col gap-2">

            <Label>What&apos;s on your mind?</Label>

            <Textarea 
              name="body" 
              required 
              defaultValue={journalEntryData?.body}
            />

          </div>
        </CardContent>

        <CardFooter className="flex justify-between">

          <Button variant="destructive" asChild>
            <Link href="/dashboard/journal">Cancel</Link>
          </Button>

          <SubmitButton buttonText="Save Entry"/>

        </CardFooter>
      </form>
    </Card>
  )
}
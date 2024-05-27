import { SubmitButton } from "@/app/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/db";
import Link from "next/link";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function NewJournalEntryPage() {

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  async function postJournalEntry(formData: FormData) {
    "use server"

    if (!user) {
      throw new Error("Not Authenticated")
    }

    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    await prisma.journalEntry.create({
      data: {
        userId: user.id,
        title: title,
        body: body
      }
    })

    return redirect("/dashboard/journal")
  }

  return (
    <Card>
      <form action={postJournalEntry}>
        <CardHeader>
          <CardTitle>New Journal Entry</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-y-5">

          <div className="gap-y-2 flex flex-col">
            <Label>Title</Label>
            <Input required name="title" type="text" placeholder="Enter a title for your journal entry" />
          </div>

          <div className="flex flex-col gap-2">

            <Label>What&apos;s on your mind?</Label>

            <Textarea name="body" required />

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
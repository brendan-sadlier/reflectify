import { DeleteEntryButton } from "@/app/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Pencil } from "lucide-react";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

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
      createdAt: true,
      id: true
    }
  });

  return data;
}

export default async function ViewJournalPage({ params, } : { params: { id: string }; }) {

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const journalEntryData = await getJournalEntry({userId: user?.id as string, journalEntryId: params.id});

  async function deleteJournalEntry(formData: FormData) {
    "use server"

    const journalEntryId = formData.get("journalEntryId") as string;

    await prisma.journalEntry.delete({
      where: {
        id: journalEntryId
      }
    })

    redirect('/dashboard/journal')
  }

  return (
    <div>
      <Card className="col-span-2 xl:col-span-3">

        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle className="text-lg">{journalEntryData?.title}</CardTitle>
            <CardDescription>{formatDate(journalEntryData?.createdAt ?? "")}</CardDescription>
          </div>

          <Button asChild size="icon" className="ml-auto gap-1 mr-2">

            <Link href={`/dashboard/new-journal-entry/${journalEntryData?.id}`}>
              <Button size="icon">
                <Pencil className="w-4 h-4"/>
              </Button>
            </Link>

          </Button>

          <form action={deleteJournalEntry}>
              <input type="hidden" name="journalEntryId" value={journalEntryData?.id} />
              <DeleteEntryButton />
          </form>

        </CardHeader>

        <CardContent>
            
          <p className="text-sm">
            {journalEntryData?.body}
          </p>

        </CardContent>

      </Card>
    </div>

  )
}
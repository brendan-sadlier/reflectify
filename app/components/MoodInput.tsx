import { SubmitButton } from "@/app/components/SubmitButton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

export default async function MoodInput() {

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  async function postMood(formData: FormData) {
    "use server"

    if (!user) {
      throw new Error("Not Authenticated")
    }

    const currentMood = formData.get("mood") as string;
    const body = formData.get("body") as string;

    await prisma.moodEntry.create({
      data: {
        userId: user.id,
        mood: currentMood,
        body: body
      }
    })

    revalidatePath("/dashboard/mood-tracker")
  }

  return (
    <Card>
      <form action={postMood}>
        <CardHeader>
          <CardTitle>How are you feeling?</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-y-5 hover:cursor-pointer">

          <div className="gap-y-2 flex flex-col">
            <Select name="mood">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="What's your mood right now?"/>
              </SelectTrigger>
              
              <SelectContent>
                <SelectGroup >
                  <SelectItem className="hover:cursor-pointer" value="happy">Happy</SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="excited">Excited</SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="calm">Calm</SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="content">Content</SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="sad">Sad</SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="anxious">Anxious</SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="stressed">Stressed</SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="frustrated">Frustrated</SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="angry">Angry</SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="tired">Tired</SelectItem>
                </SelectGroup>
              </SelectContent>
          </Select>
          </div>

          <div className="flex flex-col gap-2">

            <Label>Why do you feel like this?</Label>

            <Textarea name="body" required />

          </div>
        </CardContent>

        <CardFooter className="flex justify-end">

          <SubmitButton buttonText="Log Mood"/>

        </CardFooter>
      </form>
    </Card>
  )
}
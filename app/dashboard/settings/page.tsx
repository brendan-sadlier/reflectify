import { SubmitButton } from "@/app/components/SubmitButton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

async function getUserData(userId: string) {

  noStore();

  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      colorScheme: true,
    }
  })

  return userData;

}


export default async function SettingsPage() {

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getUserData(user?.id as string);

  async function saveChanges(formData: FormData) {
    "use server";

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name: formData.get('name') as string ?? undefined,
        colorScheme: formData.get('color') as string ?? undefined,
      }
    });

    revalidatePath('/', "layout");

  }

  return (
    <div className="grid items-start gap-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl">Settings</h1>
          <p className="text-lg text-muted-foreground">Manage your account settings</p>
        </div>
      </div>

      <Card>
        <form action={saveChanges}>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Update your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">

              <div className="space-y-1">

                <Label>Name</Label>
                <Input
                  name="name"
                  type="text"
                  id="name" 
                  placeholder="What's your name?"
                  defaultValue={data?.name ?? undefined}
                />

              </div>

              <div className="space-y-1">

                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  id="email" 
                  placeholder="What's your email?"
                  defaultValue={data?.email as string}
                  disabled
                />

              </div>

              <div className="space-y-1">

                <Label>Color Scheme</Label>
                <Select name="color" defaultValue={data?.colorScheme ?? undefined}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="What's your favorite color?"/>
                  </SelectTrigger>
                  <SelectContent>

                    <SelectGroup>
                      <SelectLabel>Color</SelectLabel>
                      <SelectItem value="theme-green">Green</SelectItem>
                      <SelectItem value="theme-blue">Blue</SelectItem>
                      <SelectItem value="theme-violet">Violet</SelectItem>
                      <SelectItem value="theme-yellow">Yellow</SelectItem>
                      <SelectItem value="theme-orange">Orange</SelectItem>
                      <SelectItem value="theme-red">Red</SelectItem>
                      <SelectItem value="theme-rose">Rose</SelectItem>
                    </SelectGroup>

                  </SelectContent>
                </Select>

              </div>

            </div>
          </CardContent>

          <CardFooter>
            <SubmitButton buttonText="Save Changes"/>
          </CardFooter>

        </form>
      </Card>



    </div>
  )
}
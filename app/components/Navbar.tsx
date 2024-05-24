import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { UserDropdown } from "./UserDropdown";
import { use } from "react";

export async function Navbar() {

  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();

  return (

    <nav className="border-b bg-background h-[10vh] flex items-center">

      <div className="container flex items-center justify-between">
        <Link href="/">
          <h1 className="font-bold text-3xl">Reflect<span className="text-primary">ify</span></h1>
        </Link>

        <div className="flex items-center gap-x-5">
          <ThemeToggle />

          {(await isAuthenticated()) ? (
            <UserDropdown email={user?.email as string} image={user?.picture as string} name={user?.given_name as string}/>
          ) : (
            <div className="flex items-center gap-x-5">
              <LoginLink>
                <Button>Sign In</Button>
              </LoginLink>
              <RegisterLink>
                <Button variant="secondary">Sign Up</Button>
              </RegisterLink>
            </div>     
          )} 

        </div>
      </div>
    </nav>

  )
}
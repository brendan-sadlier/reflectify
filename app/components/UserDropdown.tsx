export const userDropdownItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Mood Tracker",
    href: "/dashboard/mood-tracker",
    icon: Brain,
  },
  {
    name: "Journal",
    href: "/dashboard/journal",
    icon: Notebook,
  },
  {
    name: "Settings",
    href: "dashboard/settings",
    icon: Settings,
  },
];

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DoorClosed, Settings, Home, Brain, Notebook } from "lucide-react";
import Link from "next/link";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { UserDetails } from "@/lib/interface";
import { getInitial } from "@/lib/utils";

export function UserDropdown(
  { name, email, profileImage }: {
    name: string;
    email: string;
    profileImage: string;
  }
) {
  return (
    <DropdownMenu>
      
      <DropdownMenuTrigger asChild>
        
        <Button variant="ghost"className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarImage src={profileImage} alt="User Profile Image"/>
            <AvatarFallback>{getInitial(name)}</AvatarFallback>
          </Avatar>
        </Button>
      
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none">{name}</p>
            <p className="text-xs font-medium leading-none text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>

          {userDropdownItems.map((item, index) => (
            <DropdownMenuItem asChild key={index} className="hover:cursor-pointer">
              <Link href={item.href} className="w-full flex justify-between items-center">
                {item.name}
                <span><item.icon className="w-4 h-4" /></span>
              </Link>
            </DropdownMenuItem>
          ))}

        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="w-full flex justify-between items-center hover:cursor-pointer">
          <LogoutLink>
            Logout{" "}<span><DoorClosed className="w-4 h-4" /></span>
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
"use client";

import { cn } from "@/lib/utils";
import { Home, Notebook, Brain, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const otherValidPaths = [
  "/dashboard/journal/view-journal/[id]",
]

export const navItems = [
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
  }
];

export function DashboardSidebar() {

  const pathname = usePathname();
  

  return (
    <nav className="grid items-start gap-2">

      {navItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <span className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium cursor-pointer transition-colors duration-150 ease-in-out hover:bg-accent hover:text-accent-foreground hover:font-bold",
            pathname === item.href || otherValidPaths.includes(pathname)
            ? "bg-primary text-primary-foreground hover:bg-primary hover:text-accent-foreground" 
            : "bg-transparent text-accent-foreground group-hover:text-accent-foreground hover:text-primary"
          )}>
            <item.icon className="mr-2 h-4 w-4"/>
            <span>{item.name}</span>
          </span>
        </Link>
      ))}

    </nav>
  )

}
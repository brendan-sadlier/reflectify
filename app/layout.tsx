import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Navbar } from "./components/Navbar";

import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore as noStore } from "next/cache";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reflectify",
  description: "Reflectify is a simple, privacy-focused mood logging and journaling app.",
};

async function getTheme(userId: string) {

  noStore();

  if (userId) {
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        colorScheme: true,
      },
    });
    return data;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userTheme = await getTheme(user?.id as string);

  return (
    <html lang="en">
      
      <body className={`${montserrat.className} ${userTheme?.colorScheme ?? "theme-blue"}`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
        <Navbar />
        {children}
        </ThemeProvider>
        </body>
    </html>
  );
}

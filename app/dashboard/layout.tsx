import { DashboardSidebar } from "../components/DashboardSidebar";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (

    <div className="flex flex-col space-y-6 mt-10">

      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">

        <aside className="hidden w-[150px] flex-col md:flex">
          <DashboardSidebar />
        </aside>

        <main className="flex flex-col space-y-6">
          {children}
        </main>

      </div>

    </div>

  )
}
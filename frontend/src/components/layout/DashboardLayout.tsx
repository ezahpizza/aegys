import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-body flex flex-col">
      <header className="w-full py-4 px-6 bg-midblck flex items-center justify-between shadow">
        <div className="font-script text-3xl text-lavpink tracking-wider select-none">aegys</div>
        <div className="font-heading text-midblck text-lg">Warranty & Bill Organizer</div>
      </header>
      <main className="flex-1 w-full max-w-5xl mx-auto px-2 md:px-0 py-8">
        {children}
      </main>
    </div>
  );
}

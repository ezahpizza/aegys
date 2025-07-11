import { ReactNode } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-magpink min-h-screen w-full font-body flex flex-col overflow-x-hidden overflow-y-scroll  scroll-hidden">
      <header className="w-full py-2 px-6 bg-midblck flex items-center justify-between shadow">
        <button onClick={() => navigate('/')}>
            <img 
              src='/assets/aegys_logo_white.svg' 
              alt='aegys logo' 
              className="w-32 h-16 md:w-56 md:h-24 object-contain relative z-10"
            />
        </button>

         <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="relative left-0 top-0 text-midblck bg-lavpink hover:bg-raspink font-body"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
          </Button>
        </header>
      <main className="flex-1 max-w-5xl w-full h-full mx-auto px-2 md:px-0 py-8">
        {children}
      </main>
    </div>
  );
}

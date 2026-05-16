import { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-lg">
            <Sparkles size={16} className="text-primary" />
          </div>
          <span className="font-bold text-xl text-text-primary tracking-tight">Break It Down</span>
        </div>

        <div className="p-8 bg-surface border border-text-secondary/5 rounded-3xl shadow-sm">
          <h1 className="text-2xl font-light text-text-primary mb-1 text-center">{title}</h1>
          <p className="text-text-secondary text-sm text-center mb-8">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

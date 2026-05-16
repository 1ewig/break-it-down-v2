import { LucideIcon } from 'lucide-react';
import { InputHTMLAttributes } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
}

export function AuthInput({ label, icon: Icon, ...props }: AuthInputProps) {
  return (
    <div>
      <label htmlFor={props.id} className="sr-only">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          {...props}
          className="w-full pl-10 pr-4 py-3 bg-background border border-text-secondary/10 rounded-2xl text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-primary/50 transition-colors text-sm"
        />
      </div>
    </div>
  );
}

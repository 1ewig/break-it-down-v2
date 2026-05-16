import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface AuthButtonProps {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
  type?: 'submit' | 'button';
  onClick?: () => void;
  showIcon?: boolean;
}

export function AuthButton({ 
  children, 
  loading, 
  loadingText, 
  type = 'submit', 
  onClick,
  showIcon = true
}: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="w-full py-3 px-4 bg-primary text-white rounded-2xl hover:bg-primary-hover transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? loadingText : children}
      {!loading && showIcon && <ArrowRight size={16} />}
    </button>
  );
}

'use client';

import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="w-full max-w-sm p-8 bg-surface border border-text-secondary/5 rounded-3xl shadow-sm">
        <h1 className="text-2xl font-light text-text-primary mb-6 text-center">Start Fresh</h1>
        <p className="text-text-secondary text-sm text-center mb-8">Join us for a calmer way to get things done.</p>
        
        <div className="space-y-4">
          <button className="w-full py-3 px-4 bg-primary text-white rounded-2xl hover:bg-primary-hover transition-colors">
            Create Account
          </button>
        </div>
        
        <p className="mt-8 text-center text-sm text-text-secondary">
          Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

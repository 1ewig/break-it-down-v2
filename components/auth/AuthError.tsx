'use client';

import Link from 'next/link';

interface AuthErrorProps {
  message: string;
  link?: {
    href: string;
    label: string;
  };
}

export function AuthError({ message, link }: AuthErrorProps) {
  return (
    <p className="text-red-400 text-sm text-center">
      {message}{link && (
        <>
          {' '}
          <Link href={link.href} className="text-primary hover:underline">
            {link.label}
          </Link>
        </>
      )}
    </p>
  );
}

import type {Metadata} from 'next';
import {Quicksand} from 'next/font/google';
import './globals.css';

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
});

import QueryProvider from '@/providers/QueryProvider';
import AuthProvider from '@/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'Break It Down',
  description: 'A deeply empathetic, calming task-management assistant.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={quicksand.variable}>
      <body className="antialiased min-h-screen font-sans selection:bg-primary/30" suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

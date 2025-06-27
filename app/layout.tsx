import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SidebarLayoutClient from '@/components/sidebar-layout-client';
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Decorly',
  description: 'Style your space—see it before you buy it.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <SidebarLayoutClient>{children}</SidebarLayoutClient>
        </body>
      </html>
    </ClerkProvider>
  );
}




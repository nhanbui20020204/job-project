'use client'

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from './Components/Client/Header/page';
import { usePathname } from 'next/navigation';
import AdminSidebar from './Components/admin/AdminSliebar/page';
import Footer from './Components/Client/Footer/page';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {isAdminRoute ? (
          <>
            <AdminSidebar handleLogout={() => console.log('Logout')} />
            <main>{children}</main>
          </>
        ) : (
          <>
            <Header />
            <main>{children}</main>
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}

import Navbar from '@/components/navbar';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen h-screen overflow-y-hidden">
        <Navbar />
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}

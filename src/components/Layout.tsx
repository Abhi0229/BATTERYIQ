import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatBot from './ChatBot';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 lg:pt-32">{children}</main>
      <Footer />
      <ChatBot />
    </div>
  );
}

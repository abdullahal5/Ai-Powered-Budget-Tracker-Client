import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/shared/Navbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Good Budget",
  description: "Envelope-style budgeting system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider signInUrl="sign-in" signUpUrl="sign-up">
      <html className="scroll-smooth" lang="en">
        <body className={`${inter.className} antialiased`}>
          <Navbar />
          {children}
          <Toaster richColors />
          {/* footer */}
        </body>
      </html>
    </ClerkProvider>
  );
}

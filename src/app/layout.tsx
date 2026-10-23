import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/trpc/client";
import { SidebarProvider } from "./sidebar-context";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smith Family Slides",
  description: "A collection of slides for the Smith family.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
        defer
        data-website-id="18b18dbe-c773-40da-8b4d-b09e5c5b098e"
        data-domain="https://twothirtytwo.net"
        src="https://webtracking.io/analytics.js"
      ></script>
      </head>
      
      <body className={inter.className}>
        <SidebarProvider>
          <TRPCProvider>{children}</TRPCProvider>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}

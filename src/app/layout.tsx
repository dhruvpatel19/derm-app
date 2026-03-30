import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const bodyFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const headingFont = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DermEd Studio",
  description:
    "A polished dermatology education workspace for condition review, morphology training, clinical reasoning, and procedural simulation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bodyFont.variable} ${headingFont.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full text-foreground selection:bg-primary/20 selection:text-foreground">
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col overflow-x-clip bg-background">
            <SiteHeader />
            <main className="relative z-10 flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

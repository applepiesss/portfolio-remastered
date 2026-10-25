import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Nadia Aisyah Fazila — Portfolio",
  description:
    "Computer Science student at Universitas Indonesia building across backend systems and frontend interfaces.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="pink"
      className={`${jakarta.variable} ${sora.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}

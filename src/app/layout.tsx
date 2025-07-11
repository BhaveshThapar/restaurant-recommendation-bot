import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Restaurant Recommendation Bot - AI-Powered Restaurant Assistant",
  description: "Get personalized restaurant recommendations, compare restaurants, and discover the best dishes using AI-powered Reddit reviews and web search.",
  keywords: "restaurant, recommendation, chatbot, AI, food, dining, reviews, Reddit, search",
  authors: [{ name: "Restaurant Recommendation Bot" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

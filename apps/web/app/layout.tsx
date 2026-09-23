import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Investment Advisor",
  description: "AI-assisted investment research workspace",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


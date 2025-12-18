import "./globals.css";
import type { Metadata } from "next";
import NavigationMenu from "@/components/NavigationMenu/NavigationMenu";
import { ReactNode } from "react";
import { openSans } from "../fonts";
import TopMenu from "@/components/TopMenu/TopMenu";
import { ReduxProvider } from "@/components/ReduxProvider/ReduxProvider";

export const metadata: Metadata = {
  title: "INVENTORY",
  icons: "/logo.png",
  description: "Orders & Products.",
  openGraph: {
    title: "Orders & Products.",
    description: "Orders & Products.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <ReduxProvider>
          <TopMenu />
          <div className="app-layout">
            <NavigationMenu />
            <main className="main-content">{children}</main>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}

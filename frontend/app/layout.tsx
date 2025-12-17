import type { Metadata } from "next";

import "./globals.css";
// import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
// import Header from "@/components/Header/Header";
// import Footer from "@/components/Footer/Footer";
// import AuthProvider from "@/components/AuthProvider/AuthProvider";

export const metadata: Metadata = {
  title: "INVENTORY",
  icons: "/logo.png",
  description: "Orders & Products.",
  openGraph: {
    title: "Orders & Products.",
    description: "Orders & Products.",
  },
};
import "./globals.css";
// import { ReduxProvider } from "@/redux/store";
// import TanStackProvider from "@/components/queryClient";
// import "bootstrap/dist/css/bootstrap.min.css";
import NavigationMenu from "@/components/NavigationMenu/NavigationMenu";
import { ReactNode } from "react";
import { openSans } from "../fonts";
import TopMenu from "@/components/TopMenu/TopMenu";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        {" "}
        {/* <ReduxProvider> */}
        {/* <TanStackProvider> */}
        <TopMenu />
        <div className="app-layout">
          <NavigationMenu />
          <main className="main-content">{children}</main>
        </div>
        {/* </TanStackProvider> */}
        {/* </ReduxProvider> */}
      </body>
    </html>
  );
}

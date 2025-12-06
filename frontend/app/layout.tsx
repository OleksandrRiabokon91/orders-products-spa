import type { Metadata } from "next";
import { Sora, Nunito_Sans } from "next/font/google";
import "./globals.css";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
// import Header from "@/components/Header/Header";
// import Footer from "@/components/Footer/Footer";
// import AuthProvider from "@/components/AuthProvider/AuthProvider";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sora",
  display: "swap",
});
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-nunito_Sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orders & Products.",
  description: "Orders & Products.",
  openGraph: {
    title: "Orders & Products.",
    description: "Orders & Products.",
    // url: "https://podorognuk.com",
    // images: [
    //   {
    // url: "/favicon.svg",
    // alt: "Подорожник",
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
  },
  // icons: {
  //   icon: "/favicon.svg",
  // },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} ${sora.variable}`}>
        <TanStackProvider>
          {/* <AuthProvider> */}
          {/* <Header /> */}
          <main>{children}</main>
          <div id="loader-root"></div>
          {/* <Footer /> */}
          {/* </AuthProvider> */}
        </TanStackProvider>
      </body>
    </html>
  );
}

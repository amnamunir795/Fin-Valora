import "@/styles/globals.css";
import "@/styles/featuresecstyle.css";
import { Plus_Jakarta_Sans, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";

const fontBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jb-mono",
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <div
      className={`${fontBody.variable} ${fontDisplay.variable} ${fontMono.variable} min-h-screen font-sans text-void antialiased`}
    >
      <Component {...pageProps} />
    </div>
  );
}

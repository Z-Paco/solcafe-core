import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, EB_Garamond } from "next/font/google";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import RevealObserver from "@/components/common/RevealObserver";
import GlassDefs from "@/components/glass/GlassDefs";
import { copyText } from "@/content/copy";
import "./styles/globals.css";

// Display and headings: a Renaissance Garamond.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

// Inscription capitals for short labels, after Roman carved lettering.
const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inscr",
});

// Body text.
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-body",
});

const SITE_URL = "https://www.solcafe.ca";
// Builder-authored description from content/copy.ts; undefined while unwritten.
const SITE_DESCRIPTION = copyText("site.description");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SolCafe",
    template: "%s · SolCafe",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "SolCafe",
    locale: "en_CA",
    url: "/",
    title: "SolCafe",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: "SolCafe",
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edf1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1613" },
  ],
};

// Runs before first paint so a stored theme choice never flashes, and marks
// the page as scripted so scroll reveals only hide content when JS can show it.
const themeInitScript = `(function(){var d=document.documentElement;d.setAttribute("data-js","");try{var t=localStorage.getItem("solcafe-theme");if(t==="light"||t==="dark"){d.setAttribute("data-theme",t);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVars = [cormorant, cinzel, ebGaramond].map((f) => f.variable).join(" ");
  return (
    <html lang="en-CA" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <GlassDefs />
        <Header />
        {children}
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}

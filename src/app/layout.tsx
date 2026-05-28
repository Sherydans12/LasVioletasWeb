import type { Metadata, Viewport } from "next";
import { Cinzel, Montserrat, Geist_Mono } from "next/font/google";
import { OrganizationSchema } from "@/components/shared/OrganizationSchema";
import { SiteHeaderScrollProvider } from "@/contexts/site-header-scroll";
import { TopHeader } from "@/components/shared/TopHeader";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "900"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://colegiolasvioletas.cl";
const SITE_NAME = "Instituto Las Violetas";
const SITE_DESCRIPTION =
  "Instituto Las Violetas, Coquimbo. Últimos cupos Matrícula 2026 disponibles. Nivelación y validación de estudios para adultos. Horarios vespertinos.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Últimos cupos Matrícula 2026 | Coquimbo`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Instituto Las Violetas Coquimbo",
    "educación de adultos Coquimbo",
    "nivelación de estudios Coquimbo",
    "validación de estudios Chile",
    "liceo adultos Coquimbo",
    "matrícula 2026 Coquimbo",
    "últimos cupos matrícula 2026",
    "educación vespertina Coquimbo",
    "establecimiento educacional Coquimbo",
    "educación básica adultos",
    "educación media adultos Chile",
    "Las Violetas 1159 Coquimbo",
    "programa PIE Coquimbo",
    "educación inclusiva adultos",
    "PEI liceo adultos",
    "CEIA Coquimbo",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Últimos cupos Matrícula 2026 | Coquimbo`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Nivelación y validación de estudios para adultos en Coquimbo, Chile`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Últimos cupos Matrícula 2026 | Coquimbo`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/favicon-192.png", sizes: "192x192", type: "image/png" }],
    shortcut: "/favicon-192.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4D0039" },
    { media: "(prefers-color-scheme: dark)", color: "#4D0039" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CL"
      className={`${cinzel.variable} ${montserrat.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <OrganizationSchema />
        <SiteHeaderScrollProvider>
          <TopHeader />
          {children}
        </SiteHeaderScrollProvider>
      </body>
    </html>
  );
}

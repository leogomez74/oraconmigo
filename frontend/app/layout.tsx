import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "ORAS - Servicio de Oración con IA",
    template: "%s | ORAS",
  },
  description: "Tu espacio personalizado de oración y reflexión espiritual impulsado por inteligencia artificial",
  keywords: ["oración", "inteligencia artificial", "reflexión", "espiritualidad", "fe", "oración personalizada"],
  authors: [{ name: "ORAS" }],
  creator: "ORAS",
  publisher: "ORAS",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "ORAS",
    title: "ORAS - Servicio de Oración con IA",
    description: "Tu espacio personalizado de oración y reflexión espiritual impulsado por inteligencia artificial",
  },
  twitter: {
    card: "summary_large_image",
    title: "ORAS - Servicio de Oración con IA",
    description: "Tu espacio personalizado de oración y reflexión espiritual",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

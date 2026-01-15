import type { Metadata, Viewport } from "next";
import { Geist_Mono, Prompt } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "ORA - Servicio de Oración con IA",
    template: "%s | ORA",
  },
  description: "Tu espacio personalizado de oración y reflexión espiritual impulsado por inteligencia artificial",
  keywords: ["oración", "inteligencia artificial", "reflexión", "espiritualidad", "fe", "oración personalizada"],
  authors: [{ name: "ORA" }],
  creator: "ORA",
  publisher: "ORA",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "ORA",
    title: "ORA - Servicio de Oración con IA",
    description: "Tu espacio personalizado de oración y reflexión espiritual impulsado por inteligencia artificial",
  },
  twitter: {
    card: "summary_large_image",
    title: "ORA - Servicio de Oración con IA",
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
        className={`${prompt.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}


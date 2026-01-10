import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Encuesta",
  description: "Ayúdanos a conocer tus necesidades espirituales para personalizar tu experiencia de oración",
};

export default function EncuestaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

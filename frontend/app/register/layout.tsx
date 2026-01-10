import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro",
  description: "Crea tu cuenta en ORAS y comienza tu camino de oración personalizada",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

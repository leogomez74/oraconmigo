import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Tu espacio personal de oración, reflexión y conexión espiritual",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

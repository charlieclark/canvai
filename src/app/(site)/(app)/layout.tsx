import "@/styles/globals.css";

import { type Metadata } from "next";
import { getBaseProductionUrl } from "@/lib/utils/urls";
import { AdminSidebar } from "./_components/sidebar";
import { MainContent } from "./_components/main-content";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseProductionUrl()),
  title: "Dashboard | CanvAI",
  description: "Placeholder",
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <MainContent>{children}</MainContent>
    </div>
  );
}

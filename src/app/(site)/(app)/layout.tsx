import "@/styles/globals.css";

import { type Metadata } from "next";
import { getBaseProductionUrl } from "@/lib/utils/urls";
import { AdminSidebar } from "./_components/sidebar";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseProductionUrl()),
  title: "Dashboard | Boilerplate",
  description: "Placeholder",
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 lg:pl-64">
        <div className="container relative mx-auto min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}

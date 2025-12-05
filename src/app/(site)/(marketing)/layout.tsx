import { MainNav } from "@/components/navigation/main-nav";
import { Footer } from "@/components/navigation/footer";

export default async function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Folder, Menu, Settings, Sparkles, Coins, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/trpc/react";

const navigation = [
  {
    name: "Projects",
    href: "/dashboard/projects",
    icon: Folder,
  },
  {
    name: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  // {
  //   name: "Settings",
  //   href: "/dashboard/settings",
  //   icon: Settings,
  // },
];

interface SidebarNavItemProps {
  item: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  isActive: boolean;
  onClick?: () => void;
}

function SidebarNavItem({ item, isActive, onClick }: SidebarNavItemProps) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted",
      )}
    >
      <Icon className="h-5 w-5" />
      {item.name}
    </Link>
  );
}

// Check if we're on a project detail page (e.g., /dashboard/projects/[id])
function isProjectDetailPage(pathname: string) {
  return /^\/dashboard\/projects\/[^/]+$/.test(pathname);
}

function CreditsCard() {
  const { data: creditsStatus } = api.generation.getCreditsStatus.useQuery();

  if (!creditsStatus) return null;

  // Subscribed user - show credits remaining
  if (creditsStatus.plan === "SUBSCRIBED") {
    const periodEnd = creditsStatus.creditsPeriodEnd
      ? new Date(creditsStatus.creditsPeriodEnd).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : null;

    return (
      <div className="rounded-lg border bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:from-amber-950/50 dark:to-orange-950/50">
        <div className="mb-2 flex items-center gap-2">
          <Coins className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
            Credits
          </span>
        </div>
        <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
          {creditsStatus.credits}
        </p>
        {periodEnd && (
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
            Resets {periodEnd}
          </p>
        )}
      </div>
    );
  }

  // Free user - show upgrade CTA
  return (
    <div className="rounded-lg border bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4 dark:from-violet-950/50 dark:to-fuchsia-950/50">
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
        <span className="text-sm font-medium text-violet-900 dark:text-violet-100">
          Upgrade
        </span>
      </div>
      <p className="mb-3 text-sm text-violet-700 dark:text-violet-300">
        Get 200 credits/month for unlimited generations.
      </p>
      <Button size="sm" className="w-full" asChild>
        <Link href="/dashboard/billing">
          Subscribe for $20/mo
        </Link>
      </Button>
    </div>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Hide sidebar on project detail pages and root dashboard
  if (isProjectDetailPage(pathname) || pathname === "/dashboard") {
    return null;
  }

  const handleNavItemClick = () => {
    setOpen(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b px-6">
        <Link href="/" className="text-lg font-semibold">
          CanvAi
        </Link>
        <div className="flex items-center gap-2">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <div className="flex-1 space-y-1 p-6">
        {[...navigation].map((item) => (
          <SidebarNavItem
            key={item.name}
            item={item}
            isActive={pathname === item.href}
            onClick={handleNavItemClick}
          />
        ))}
      </div>

      <div className="border-t p-4">
        <CreditsCard />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="bg-background hidden border-r lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        {sidebarContent}
      </div>

      {/* Mobile header and sidebar */}
      <div className="bg-background sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b px-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] border-r p-0 sm:w-64">
            {sidebarContent}
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center gap-x-4">
          <Link href="/" className="lg:hidden">
            <h1 className="text-lg font-semibold">CanvAi</h1>
          </Link>
        </div>
      </div>
    </>
  );
}

"use client";

import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Book, Menu, Rocket } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Boilerplate",
    href: "/dashboard/example",
    icon: Book,
  },
];

const adminNavigation = [
  {
    name: "Manage Waitlist",
    href: "/dashboard/manage-waitlist",
    icon: Rocket,
  },
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

export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleNavItemClick = () => {
    setOpen(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b px-6">
        <Link href="/" className="text-lg font-semibold">
          Boilerplate
        </Link>
        <div className="flex items-center gap-2">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <div className="flex-1 space-y-1 p-6">
        {[...adminNavigation, ...navigation].map((item) => (
          <SidebarNavItem
            key={item.name}
            item={item}
            isActive={pathname === item.href}
            onClick={handleNavItemClick}
          />
        ))}
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
            <h1 className="text-lg font-semibold">Boilerplate</h1>
          </Link>
        </div>
      </div>
    </>
  );
}

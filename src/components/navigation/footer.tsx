import Link from "next/link";
import {
  Twitter,
  Mail,
  Linkedin,
  Github,
  BookOpen,
  LampDesk,
} from "lucide-react";
import {
  productLinks,
  companyLinks,
  legalLinks,
  socialLinks,
} from "@/config/navigation";
import Image from "next/image";

const iconMap = {
  Twitter,
  Mail,
  Linkedin,
  Github,
  BookOpen,
};

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 px-6 py-12 md:grid-cols-12 lg:px-8">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2">
              <LampDesk />
              <span className="text-xl font-semibold tracking-tight">
                <span className="bg-gradient-to-r from-[#000000] to-[#575e64] bg-clip-text text-transparent">
                  nano-canvas.com
                </span>
              </span>
            </Link>
            <p className="text-muted-foreground mt-2 text-sm">
              CanvAI Tagline
            </p>
            {/* <div className="mt-6 flex gap-4">
              {socialLinks.map((link) => {
                const Icon = iconMap[link.icon as keyof typeof iconMap];
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-primary"
                    aria-label={link.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div> */}
          </div>

          {/* Product Links */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:hello@nano-canvas.com"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  hello@nano-canvas.com
                </a>
              </li>
              {/* <li>
                <Link
                  href="/support"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Support Center
                </Link>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-border border-t px-6 py-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} CanvAI. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground text-sm">
                Made by{" "}
                <Link
                  href="https://builtby.cc"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Charlie
                </Link>{" "}
                from{" "}
                <Link
                  href="https://liinks.co"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Liinks
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";
import {
  productLinks,
  companyLinks,
  legalLinks,
  socialLinks,
} from "@/config/navigation";

const iconMap = {
  Twitter,
  Mail,
  Linkedin,
  Github,
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#F5F3EE]">
      <div className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 gap-8 px-6 py-16 md:grid-cols-12 lg:px-8">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2.5">
              {/* Logo mark */}
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#0066CC] to-[#059669]" />
                <div className="absolute inset-[3px] rounded-md bg-[#F5F3EE]" />
                <div className="absolute inset-[6px] rounded bg-gradient-to-br from-[#0066CC] to-[#059669]" />
              </div>
              <span className="text-xl font-semibold tracking-tight">
                <span className="bg-gradient-to-r from-[#0066CC] to-[#059669] bg-clip-text text-transparent">
                  CanvAi
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Transform your creative vision into stunning visuals with
              AI-powered generation on an infinite canvas.
            </p>
            {/* <div className="mt-6 flex gap-4">
              {socialLinks.map((link) => {
                const Icon = iconMap[link.icon];
                if (!Icon) return null;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 transition-colors hover:text-slate-600"
                    aria-label={link.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div> */}
          </div>

          {/* Product Links */}
          <div className="md:col-span-2 md:col-start-6">
            <h3 className="text-sm font-semibold text-slate-900">Product</h3>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900">Company</h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900">Legal</h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 px-6 py-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} CanvAi. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-500">
                Made with care by{" "}
                <Link
                  href="https://builtby.cc"
                  className="font-medium text-slate-700 transition-colors hover:text-slate-900"
                >
                  Charlie
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const mainNavLinks = [
  {
    id: "features",
    label: "Features",
  },
] as const;

export const productLinks = [
  {
    href: "/#features",
    label: "Features",
  },
] as const;

export const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const legalLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/cookies", label: "Cookies" },
] as const;

export const socialLinks = [
  {
    href: "https://x.com/canvai",
    icon: "Twitter",
    label: "Twitter",
  },
  {
    href: "https://linkedin.com/company/canvai",
    icon: "Linkedin",
    label: "LinkedIn",
  },
  {
    href: "https://github.com/canvai",
    icon: "Github",
    label: "GitHub",
  },
  {
    href: "mailto:hello@canvai.co",
    icon: "Mail",
    label: "Email",
  },
] as const;

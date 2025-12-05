export function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const getBaseProductionUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.NODE_ENV === "production") return `https://www.nano-canvas.com`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

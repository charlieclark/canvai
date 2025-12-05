import { getBaseProductionUrl } from "@/lib/utils/urls";

type Config = {
  params?: Record<string, string>;
  type?: "production";
};

export const r =
  (url: string) =>
  ({ params, type }: Config = {}) => {
    const prefix = type === "production" ? getBaseProductionUrl() : "";
    const queryParams = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";

    const fullUrl = `${prefix}${url}${queryParams}`;

    return fullUrl;
  };

import { r } from "./routeHelper";

export const route_root = () => {
  return r(`/`);
};
export const route_blogSlugs = ({ slugs }: { slugs: string }) => {
  return r(`/blog/${slugs}`);
};
export const route_previewSlugs = ({ slugs }: { slugs: string }) => {
  return r(`/preview/${slugs}`);
};
export const route_dashboardAuthorsAuthorid = ({
  authorId,
}: {
  authorId: string;
}) => {
  return r(`/dashboard/authors/${authorId}`);
};
export const route_dashboardAuthorsNew = () => {
  return r(`/dashboard/authors/new`);
};
export const route_dashboardAuthors = () => {
  return r(`/dashboard/authors`);
};
export const route_dashboardAutomation = () => {
  return r(`/dashboard/automation`);
};
export const route_dashboardBilling = () => {
  return r(`/dashboard/billing`);
};
export const route_dashboardDetails = () => {
  return r(`/dashboard/details`);
};
export const route_dashboardNavigation = () => {
  return r(`/dashboard/navigation`);
};
export const route_dashboard = () => {
  return r(`/dashboard`);
};
export const route_dashboardPagesSlug = ({ slug }: { slug: string }) => {
  return r(`/dashboard/pages/${slug}`);
};
export const route_dashboardPages = () => {
  return r(`/dashboard/pages`);
};
export const route_dashboardPostsSlug = ({ slug }: { slug: string }) => {
  return r(`/dashboard/posts/${slug}`);
};
export const route_dashboardPostsSlugSettings = ({
  slug,
}: {
  slug: string;
}) => {
  return r(`/dashboard/posts/${slug}/settings`);
};
export const route_dashboardPosts = () => {
  return r(`/dashboard/posts`);
};
export const route_dashboardSettings = () => {
  return r(`/dashboard/settings`);
};
export const route_dashboardUpgrade = () => {
  return r(`/dashboard/upgrade`);
};
export const route_dashboardUpgradeSuccess = () => {
  return r(`/dashboard/upgrade/success`);
};
export const route_about = () => {
  return r(`/about`);
};
export const route_contact = () => {
  return r(`/contact`);
};
export const route_cookies = () => {
  return r(`/cookies`);
};
export const route_faq = () => {
  return r(`/faq`);
};
export const route_features = () => {
  return r(`/features`);
};
export const route_ = () => {
  return r(`/`);
};
export const route_pricing = () => {
  return r(`/pricing`);
};
export const route_privacy = () => {
  return r(`/privacy`);
};
export const route_terms = () => {
  return r(`/terms`);
};
export const route_onboarding = () => {
  return r(`/onboarding`);
};
export const route_apiBlogGenerateNewPostSlug = ({
  slug,
}: {
  slug: string;
}) => {
  return r(`/api/blog/generate-new-post/${slug}`);
};
export const route_apiCronCheckAutoPosts = () => {
  return r(`/api/cron/check-auto-posts`);
};
export const route_apiCronProcessEmailQueue = () => {
  return r(`/api/cron/process-email-queue`);
};
export const route_apiUpload = () => {
  return r(`/api/upload`);
};
export const route_robotsTxt = () => {
  return r(`/robots.txt`);
};
export const route_sitemapXml = () => {
  return r(`/sitemap.xml`);
};

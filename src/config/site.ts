export function resolveSiteOrigin(value: string | undefined) {
  if (!value) return undefined;
  const url = URL.parse(value);
  if (
    !url || url.protocol !== "https:" || url.username || url.password
    || url.pathname !== "/" || url.search || url.hash
  ) return undefined;
  return url.origin;
}

export const siteOrigin = resolveSiteOrigin(process.env.PORTFOLIO_SITE_URL);

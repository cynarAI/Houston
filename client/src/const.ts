export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const isMock = import.meta.env.VITE_DEV_MOCK_AUTH === "true";
  if (isMock) {
    // In der lokalen Mock-Entwicklung nicht ins Portal springen.
    return "/app/dashboard";
  }

  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  if (!oauthPortalUrl || !appId) {
    console.warn(
      "[Login] Missing VITE_OAUTH_PORTAL_URL or VITE_APP_ID. Falling back to dashboard.",
    );
    return "/app/dashboard";
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  try {
    // Be tolerant: some environments provide host without scheme ("portal.example.com")
    // and URL() would throw. Normalize to https:// by default.
    const normalizedBase = /^https?:\/\//i.test(oauthPortalUrl)
      ? oauthPortalUrl
      : `https://${oauthPortalUrl.replace(/^\/+/, "")}`;

    const url = new URL("/app-auth", normalizedBase);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch (error) {
    console.warn(
      "[Login] Invalid VITE_OAUTH_PORTAL_URL. Falling back to dashboard.",
      { oauthPortalUrl, error },
    );
    return "/app/dashboard";
  }

  // unreachable
};

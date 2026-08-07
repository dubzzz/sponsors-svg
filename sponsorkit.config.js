import { defineConfig, tierPresets } from "sponsorkit";

// The fast-check collective is public, so everything sponsorkit needs from
// OpenCollective (active subscriptions and current-month transactions) is
// readable without authentication. Query the API anonymously: sponsorkit
// insists on having *some* key, so a placeholder is set in the provider
// config below and stripped from every request here. Sponsorkit resolves
// globalThis.fetch lazily (via ofetch), so wrapping it here is enough.
const realFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = (input, init) => {
  const url =
    typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (!url.startsWith("https://api.opencollective.com/")) {
    return realFetch(input, init);
  }
  const headers = new Headers(init?.headers);
  headers.delete("Api-Key");
  return realFetch(input, { ...init, headers });
};

export default defineConfig({
  // Providers configs
  github: {
    // SPONSORKIT_GITHUB_TOKEN, Token requires the `read:user` and `read:org` scopes.
    login: "dubzzz",
    type: "user",
  },
  opencollective: {
    // Placeholder to satisfy sponsorkit's "key is required" check; the fetch
    // wrapper above removes it so all queries run anonymously.
    key: "anonymous-public-data",
    slug: "fast-check",
  },
  // Rendering configs
  width: 800,
  formats: ["svg"],
  // Tiers
  includePrivate: false,
  tiers: [
    {
      title: "Past Sponsors",
      monthlyDollars: -1,
      preset: tierPresets.base,
    },
    {
      title: "Backers",
      preset: tierPresets.medium,
    },
    {
      title: 'Sponsors',
      monthlyDollars: 5,
      preset: tierPresets.large,
    },
    {
      title: 'Gold Sponsors',
      monthlyDollars: 50,
      preset: tierPresets.xl,
    },
  ],
  sponsorsAutoMerge: true,
});

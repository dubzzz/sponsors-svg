import { defineConfig, tierPresets } from "sponsorkit";

// OpenCollective personal tokens are scoped, and sponsorkit needs the
// "transactions" scope for its second query. If the token behind
// SPONSORKIT_OPENCOLLECTIVE_KEY lacks a scope, retry the query anonymously:
// the fast-check collective is public, so the data is readable without
// authentication. Sponsorkit resolves globalThis.fetch lazily (via ofetch),
// so wrapping it here is enough.
const realFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = async (input, init) => {
  const response = await realFetch(input, init);
  const url =
    typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (!url.startsWith("https://api.opencollective.com/")) {
    return response;
  }
  const payload = await response
    .clone()
    .json()
    .catch(() => undefined);
  const scopeErrors = (payload?.errors ?? []).filter((error) =>
    /not allowed for operations in scope/.test(error?.message ?? ""),
  );
  if (scopeErrors.length === 0) {
    return response;
  }
  console.warn(
    `[sponsorkit.config] OpenCollective token is missing a scope (${scopeErrors
      .map((error) => error.message)
      .join("; ")}), retrying the query anonymously`,
  );
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
    // SPONSORKIT_OPENCOLLECTIVE_KEY, Create an API key at https://opencollective.com/applications
    // For a personal token, grant at least the "account" and "transactions" scopes.
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

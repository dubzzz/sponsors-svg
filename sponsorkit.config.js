import { defineConfig, presets } from "sponsorkit";

export default defineConfig({
  // Providers configs
  github: {
    // SPONSORKIT_GITHUB_TOKEN, Token requires the `read:user` and `read:org` scopes.
    login: "dubzzz",
    type: "user",
  },
  opencollective: {
    // SPONSORKIT_OPENCOLLECTIVE_KEY, Create an API key at https://opencollective.com/applications
    slug: "fast-check",
  },
  // Rendering configs
  width: 800,
  formats: ["svg"],
  // Tiers
  includePrivate: true,
  tiers: [
    {
      title: "Past Sponsors",
      monthlyDollars: -1,
      preset: presets.xs,
    },
    {
      title: "Backers",
      preset: presets.base,
    },
    {
      title: 'Sponsors',
      monthlyDollars: 5,
      preset: presets.medium,
    },
    {
      title: 'Silver Sponsors',
      monthlyDollars: 10,
      preset: presets.large,
    },
    {
      title: 'Gold Sponsors',
      monthlyDollars: 50,
      preset: presets.xl,
    },
  ],
});

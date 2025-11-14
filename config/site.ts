export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Osterran Trollball League",
  description: "Bringing you the best of the action.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Teams",
      href: "/teams",
    },
    {
      label: "Standings",
      href: "/standings",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Teams",
      href: "/teams",
    },
    {
      label: "Standings",
      href: "/standings",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
    { label: "Sponsor", href: "https://ko-fi.com/manianiac" },
  ],
  links: {
    sponsor: "https://ko-fi.com/manianiac",
  },
};

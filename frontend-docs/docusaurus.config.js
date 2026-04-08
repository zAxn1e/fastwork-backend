// @ts-check

const config = {
  title: "Fastwork Frontend Guide",
  tagline: "Frontend integration handbook for fastwork-backend",

  url: "https://example.com",
  baseUrl: "/frontend-guide/",

  organizationName: "team",
  projectName: "fastwork-frontend-docs",

  onBrokenLinks: "throw",

  i18n: {
    defaultLocale: "th",
    locales: ["th"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: false,
        pages: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: "Fastwork Frontend Guide",
      items: [
        {
          type: "docSidebar",
          sidebarId: "guideSidebar",
          position: "left",
          label: "คู่มือ",
        },
      ],
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
  },
};

module.exports = config;

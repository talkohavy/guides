// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { APP_URLS } from './utils/appConstants.js';
import { IMAGES } from './utils/images/index.js';

/** @type {import('@docusaurus/types').Config} */
const config = {
  // -------------------------
  // Category 1: Site Metadata
  // -------------------------
  title: '✨ Super Guides ✨',
  tagline: "All the tutorials you'll ever need as a developer",
  favicon: IMAGES.favicon,

  // ---------------------------------------
  // Category 2: i18n - internationalization
  // ---------------------------------------
  // Even if you don't use internalization, you can use this field to set useful metadata like html lang. For example, if your site is Chinese, you may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'he'],
  },

  // ---------------------------------
  // Category 3: Presets Configuration
  // ---------------------------------
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: APP_URLS.gitRepositoryURL, // <--- Remove this to remove the "edit this page" links.
          // sidebarCollapsed: false, // <--- defaults to `true`. Collapsible categories are collapsed by default. If you want them to be expanded on the first render, you can set collapsed to false.
        },
        blog: {
          showReadingTime: true,
          editUrl: APP_URLS.gitRepositoryURL, // <--- Remove this to remove the "edit this page" links.
        },
        theme: { customCss: './src/css/custom.css' },
      },
    ],
  ],

  // --------------------------------
  // Category 4: Plugin Configuration
  // --------------------------------
  // plugins: [],

  // -------------------------------
  // Category 5: Theme Configuration
  // -------------------------------
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  themeConfig: {
    // Replace with your project's social card
    image: IMAGES.docusaurusSocialCard,
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3, // defaults to 3. It affects how much # can be in front of a heading.
    },
    navbar: {
      hideOnScroll: false, // <--- defaults to false.
      // style: 'primary', // Possible options are: 'dark' | 'primary'
      title: 'Home',
      logo: { alt: 'My Site Logo', src: IMAGES.siteLogo },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Guides',
        },
        { to: APP_URLS.blogs, label: 'Blogs', position: 'left' },
        {
          href: APP_URLS.gitRepositoryURL,
          position: 'right',
          className: 'header-github-link',
        },
        { type: 'localeDropdown' },
      ],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        autoCollapseCategories: false, // <--- defaults to `false`. Switches an expanded category into a collapsed when you expand another category.
        hideable: true,
      },
      versionPersistence: 'localStorage', // Options are: 'localStorage' | 'none'
    },
    // announcementBar: {
    //   content: `⭐️ If you like DocSearch, give it a star on <a target="_blank" rel="noopener noreferrer" href="${APP_URLS.gitRepositoryURL}">GitHub</a>! ⭐️`,
    // },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [{ label: 'Tutorial', to: APP_URLS.docs.programming.index }],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Blog', to: APP_URLS.blogs },
            { label: 'GitHub', href: 'https://github.com/facebook/docusaurus' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
  },

  // ------------------------------------
  // Category 6: Deployment Configuration
  // ------------------------------------
  // A GitHub pages deployment config. If you aren't using GitHub pages, you don't need these.
  organizationName: 'talkohavy', // <--- Usually your GitHub org/user name.
  projectName: 'guides', // <--- Usually your repo name.
  deploymentBranch: 'gh-pages', // <--- The branch name on which the output `build` folder is deployed to
  githubHost: 'github.com',
  baseUrl: '/guides/', // <--- Set the /<baseUrl>/ pathname under which your site is served. For GitHub pages deployment, it is often '/<projectName>/'
  url: 'https://talkohavy.github.io/', // <--- Set the production url of your site here
  onBrokenLinks: 'throw', // <--- This saved me once on a broken URL on the SOLID guide. You do NOT use the baseUrl as prefix to App URLs!
  onBrokenMarkdownLinks: 'throw', // <--- was `warn`. I changed to `throw`.
  trailingSlash: true, // <--- this config is under test! Now it's set to `true`, should examine a case of `false` as well.

  // --------------------------------
  // Category 7: Custom Configuration
  // --------------------------------
  // customFields: {},
};

export default config;

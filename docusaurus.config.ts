import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';
import { APP_URLS } from './utils/appConstants.js';
import { IMAGES } from './utils/images/index.js';

const config: Config = {
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
    localeConfigs: {
      en: { htmlLang: 'en-US' }, // <--- use en-US or en-GB
      he: { direction: 'rtl' },
    },
  },

  // ---------------------------------
  // Category 3: Presets Configuration
  // ---------------------------------
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: APP_URLS.gitRepositoryURL, // <--- Remove this to remove the "edit this page" links.
          // sidebarCollapsed: false, // <--- defaults to `true`. Collapsible categories are collapsed by default. If you want them to be expanded on the first render, you can set collapsed to false.
        },
        blog: {
          showReadingTime: true,
          editUrl: APP_URLS.gitRepositoryURL, // <--- Remove this to remove the "edit this page" links.
        },
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],

  // --------------------------------
  // Category 4: Plugin Configuration
  // --------------------------------
  // plugins: [],

  // -------------------------------
  // Category 5: Theme Configuration
  // -------------------------------
  themeConfig: {
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      magicComments: [
        // 1. Override the 'highlight-start' & 'highlight-end' magic-comments
        {
          block: { start: 'highlight-start', end: 'highlight-end' },
          className: 'theme-code-block-highlighted-line',
        },
        // 2. Override the 'highlight-next-line' magic-comment
        {
          line: 'highlight-next-line',
          className: 'theme-code-block-highlighted-line',
        },
        // 3. New Block: `diff-remove-start` & `diff-remove-end` magic comments
        {
          block: { start: 'diff-remove-start', end: 'diff-remove-end' },
          className: 'custom-code-block-diff-remove',
        },
        // 4. New Block: `diff-add-start` & `diff-add-end` magic comment
        {
          block: { start: 'diff-add-start', end: 'diff-add-end' },
          className: 'custom-code-block-diff-add',
        },
        // 5. New next-line: `diff-remove-next-line` magic comment
        {
          line: 'diff-remove-next-line',
          className: 'custom-code-block-diff-remove',
        },
        // 6. New next-line: `diff-add-next-line` magic comment:
        {
          line: 'diff-add-next-line',
          className: 'custom-code-block-diff-add',
        },
      ],
    },

    // Replace with your project's social card
    image: IMAGES.docusaurusSocialCard,
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4, // defaults to 3. It affects how much # can be in front of a heading.
    },
    navbar: {
      hideOnScroll: false, // <--- defaults to false.
      // style: 'primary', // Possible options are: 'dark' | 'primary'
      title: 'Home',
      logo: {
        alt: 'My Site Logo',
        src: IMAGES.siteLogo,
        srcDark: 'img/logo_dark.svg',
        // target: '_blank', // <--- defaults to _self
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mySidebar',
          position: 'left',
          label: 'Guides',
          href: APP_URLS.docs.programming.index,
          alt: 'Developer Guides',
          // target: '_blank', // <--- defaults to _self
          // src: 'img/logo.svg',
          // srcDark: 'img/logo_dark.svg',
          // width: 132,
          // height: 132,
          // className: 'custom-navbar-logo-class',
          // style: { border: 'solid red' },
        },
        { to: APP_URLS.blogs, label: 'Blogs', position: 'left' },
        { type: 'localeDropdown', position: 'right' },
        {
          href: APP_URLS.gitRepositoryURL,
          position: 'right',
          className: 'header-github-link',
        },
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
  } satisfies Preset.ThemeConfig,

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

  // -------------------------
  // Category 7: Static assets
  // -------------------------
  staticDirectories: ['static'], // <--- defaults to 'static'

  // --------------------------------
  // Category 8: Custom Configuration
  // --------------------------------
  // customFields: {},
};

export default config;

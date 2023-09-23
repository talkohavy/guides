const { APP_URLS } = require('./utils/appConstants.js');
const { IMAGES } = require('./utils/images/index.js');

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  // -------------------------
  // Category 1: Site Metadata
  // -------------------------
  title: 'Full Stack Developer',
  tagline: 'Super Guides',
  favicon: IMAGES.favicon,

  // Set the production url of your site here
  url: 'https://your-docusaurus-test-site.com',
  // Set the /<baseUrl>/ pathname under which your site is served

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'he'],
  },

  // ---------------------------------
  // Category 2: Presets Configuration
  // ---------------------------------
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  // --------------------------------
  // Category 3: Plugin Configuration
  // --------------------------------
  // plugins: [],

  // -------------------------------
  // Category 4: Theme Configuration
  // -------------------------------
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      // Replace with your project's social card
      image: IMAGES.docusaurusSocialCard,
      navbar: {
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
            href: 'https://github.com/facebook/docusaurus',
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
          hideable: true,
        },
      },
      // announcementBar: {
      //   content:
      //     '⭐️ If you like DocSearch, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/algolia/docsearch">GitHub</a>! ⭐️',
      // },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [{ label: 'Tutorial', to: APP_URLS.guides.intro }],
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
              {
                label: 'Blog',
                to: APP_URLS.blogs,
              },
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    },

  // ------------------------------------
  // Category 5: Deployment Configuration
  // ------------------------------------
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'talkohavy', // Usually your GitHub org/user name.
  projectName: 'guides', // Usually your repo name.
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  // deploymentBranch: 'master',

  // --------------------------------
  // Category 6: Custom Configuration
  // --------------------------------
  // customFields: {},
};

module.exports = config;

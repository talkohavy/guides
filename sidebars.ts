import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a sidebar for each doc of that group
 * - provide next/previous navigation
 *
 * The sidebars can be generated from the filesystem, or explicitly defined here.
 *
 * Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{ type: 'autogenerated', dirName: '.' }],

  // But you can create a sidebar manually

  mySidebar: [
    {
      type: 'category',
      label: 'Photoshop',
      description: 'this is so wrong',
      collapsible: true, // Set the category to be collapsible
      collapsed: true, // Set the category to be initially collapsed or open by default
      link: {
        type: 'generated-index',
        title: 'Photoshop Guides',
        description: 'Learn about photoshop concepts!',
        slug: '/category/photoshop-guides',
        keywords: ['photoshop'],
        image: '/img/undraw_docusaurus_react.svg',
      },
      items: [
        {
          type: 'doc',
          id: 'photoshop/index',
          label: '- Photoshop',
        },
      ],
    },
    {
      type: 'category',
      label: 'Programming',
      collapsible: true, // Set the category to be collapsible
      collapsed: false, // Set the category to be initially collapsed or open by default
      link: {
        type: 'generated-index',
        title: 'Programming Guides',
        description: 'All the information a developer needs',
        slug: '/programming', // defaults to: '/category/[categoryName]'
        keywords: ['programming', 'git', 'css', 'ssh', 'docker', 'helm', 'node', 'nestjs'],
        image: '/img/undraw_docusaurus_react.svg',
      },
      items: [
        {
          type: 'category',
          label: '- Software Concepts',
          link: {
            type: 'generated-index',
            title: 'Software Concepts Guides',
            description: 'Software development concepts',
            slug: '/software-concepts', // defaults to: '/category/[categoryName]'
            keywords: ['software'],
            image: '/img/heart.svg',
          },
          items: [
            {
              type: 'doc',
              id: 'programming/concepts/solid',
              label: '-- SOLID',
            },
            {
              type: 'doc',
              id: 'programming/concepts/design-by-contract',
              label: '-- Design By Contract',
            },
          ],
        },
        {
          type: 'category',
          label: '- Web',
          link: {
            type: 'generated-index',
            title: 'Web Guides',
            description: 'Advanced concepts of the web',
            slug: '/web',
            keywords: ['web'],
            image: '/img/heart.svg',
          },
          items: [
            {
              type: 'doc',
              id: 'programming/web/fetch-api',
              label: '- Fetch API',
            },
            {
              type: 'doc',
              id: 'programming/web/headers',
              label: '- Headers',
            },
          ],
        },
        {
          type: 'category',
          label: '- Javascript',
          link: {
            type: 'generated-index',
            title: 'JavaScript Guides',
            description: 'Advanced concepts of JavaScript',
            slug: '/js',
            keywords: ['javascript'],
          },
          items: [
            {
              type: 'doc',
              id: 'programming/javascript/call-apply-bind',
              label: '- Call, Apply & Bind',
            },
            {
              type: 'doc',
              id: 'programming/javascript/iterator',
              label: '- Iterator',
            },
            {
              type: 'doc',
              id: 'programming/javascript/getters-and-setters',
              label: '- Getters & Setters',
            },
            {
              type: 'doc',
              id: 'programming/javascript/strict-mode',
              label: '- Strict Mode',
            },
            {
              type: 'doc',
              id: 'programming/javascript/prototype',
              label: '- Prototype',
            },
            {
              type: 'doc',
              id: 'programming/javascript/valueOf',
              label: '- valueOf',
            },
            {
              type: 'doc',
              id: 'programming/javascript/finalization-registry',
              label: '- FinalizationRegistry',
            },
          ],
        },
        {
          type: 'category',
          label: '- Http',
          link: {
            type: 'generated-index',
            title: 'Http Guides',
            description: 'Advanced concepts of Http',
            slug: '/http',
            keywords: ['http'],
          },
          items: [
            {
              type: 'doc',
              id: 'programming/http/overview',
              label: '- Http Overview',
            },
            {
              type: 'doc',
              id: 'programming/http/http-messages',
              label: '- Http Messages',
            },
            {
              type: 'doc',
              id: 'programming/http/http1-limitations-and-http2',
              label: '- Http/1 Limitations & Http/2',
            },
            {
              type: 'doc',
              id: 'programming/http/mime-type',
              label: '- MIME types',
            },
          ],
        },
        {
          type: 'category',
          label: '- Html',
          link: {
            type: 'generated-index',
            title: 'Html Guides',
            description: 'Advanced concepts of Html',
            slug: '/html',
            keywords: ['html'],
          },
          items: [
            {
              type: 'doc',
              id: 'programming/html/inert',
              label: '- Inert',
            },
            {
              type: 'doc',
              id: 'programming/html/history',
              label: '- History',
            },
            {
              type: 'doc',
              id: 'programming/html/iframe',
              label: '- Iframe',
            },
          ],
        },
        {
          type: 'category',
          label: '- Databases',
          link: {
            type: 'generated-index',
            title: 'Databases Guides',
            description: 'All about databases',
            slug: '/db',
            keywords: ['database'],
          },
          items: [
            {
              type: 'doc',
              id: 'programming/databases/elasticsearch',
              label: '- ElasticSearch',
            },
            {
              type: 'doc',
              id: 'programming/databases/mongodb',
              label: '- MongoDB',
            },
            {
              type: 'doc',
              id: 'programming/databases/redis',
              label: '- Redis',
            },
          ],
        },
        {
          type: 'doc',
          id: 'programming/aws-kubernetes',
          label: '- AWS Kubernetes',
        },
        {
          type: 'doc',
          id: 'programming/crypto',
          label: '- Crypto',
        },
        {
          type: 'doc',
          id: 'programming/certificates',
          label: '- Certificates',
        },
        {
          type: 'doc',
          id: 'programming/css',
          label: '- CSS',
        },
        {
          type: 'doc',
          id: 'programming/design-patterns',
          label: '- Design Patterns',
        },
        {
          type: 'doc',
          id: 'programming/docker',
          label: '- Docker',
        },
        {
          type: 'doc',
          id: 'programming/elk',
          label: '- ELK Stack',
        },
        {
          type: 'doc',
          id: 'programming/git',
          label: '- Git',
        },
        {
          type: 'doc',
          id: 'programming/helm',
          label: '- Helm',
        },
        {
          type: 'doc',
          id: 'programming/kubernetes',
          label: '- Kubernetes',
        },
        {
          type: 'doc',
          id: 'programming/micro-frontends',
          label: '- Micro-Frontends',
        },
        {
          type: 'doc',
          id: 'programming/nest',
          label: '- NestJS',
        },
        {
          type: 'doc',
          id: 'programming/node',
          label: '- Node',
        },
        {
          type: 'doc',
          id: 'programming/npm',
          label: '- npm publish a package',
        },
        {
          type: 'doc',
          id: 'programming/postgres-sql',
          label: '- postgressql',
        },
        {
          type: 'doc',
          id: 'programming/python-server',
          label: '- Python Server',
        },
        {
          type: 'doc',
          id: 'programming/regex',
          label: '- Regex',
        },
        {
          type: 'doc',
          id: 'programming/saml',
          label: '- SAML',
        },
        {
          type: 'doc',
          id: 'programming/software-architecture',
          label: '- Software Architecture',
        },
        {
          type: 'doc',
          id: 'programming/ssh',
          label: '- SSH',
        },
        {
          type: 'doc',
          id: 'programming/storybook',
          label: '- Storybook',
        },
        {
          type: 'doc',
          id: 'programming/syntax-highlighting',
          label: '- Syntax Highlighting',
        },
        {
          type: 'doc',
          id: 'programming/what-is-long-polling',
          label: '- What is Long-Polling',
        },
      ],
    },
    {
      type: 'category',
      label: 'Video Editing',
      items: [
        {
          type: 'doc',
          id: 'video-editing/ffmpeg',
          label: '- FFmpeg',
        },
      ],
    },
    {
      type: 'category',
      label: 'MISC',
      items: [
        {
          type: 'doc',
          id: 'job-interview',
          label: '- Job Interview',
        },
      ],
    },
  ],
};

export default sidebars;

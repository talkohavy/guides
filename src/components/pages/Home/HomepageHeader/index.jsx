import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import styles from './index.module.css';

// import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function HomepageHeader() {
  // const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className='container'>
        <Heading as='h1' className='hero__title' translate='yes'>
          {translate({
            id: 'page.home.h1',
            message: '✨ Super Guides ✨',
            description: 'The homepage welcome message',
          })}
        </Heading>

        <p className='hero__subtitle'>
          {translate({ id: 'pages.home.tagline', message: "All the tutorials you'll ever need as a developer" })}
        </p>
        <div className={styles.buttons}>
          <Link className='button button--secondary button--lg' to='/docs/programming'>
            {translate({ id: 'pages.home.tagline', message: 'Docusaurus Tutorial - 5min' })}&nbsp;⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

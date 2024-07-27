import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function FeatureCard({ Svg, title, description }) {
  return (
    <div className='col col--4'>
      <div className='text--center'>
        <Svg className={styles.featureSvg} role='img' />
      </div>
      <div className='text--center padding-horiz--md'>
        <Heading as='h3'>{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

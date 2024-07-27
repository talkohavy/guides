import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureCardProps = {
  Svg: any;
  title: any;
  description: any;
};

export default function FeatureCard(props: FeatureCardProps) {
  const { Svg, description, title } = props;

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

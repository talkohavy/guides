---
sidebar_label: '21. Syntax Highlighting'
sidebar_position: 20
---

# Syntax Highlighting in Docusaurus

## **1. Highlight 1 line**

Use the comment:

```js
/// highlight-next-line
```

And the result would be:

```js
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function FeatureCard({ Svg, title, description }) {
  // highlight-next-line
  if (!title) throw new Error('bye bye');

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
```

## **2. Highlight multiple lines**

Use the comments:

```js
/// highlight-start
/// highlight-end
```

And the result would be:

```js
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function FeatureCard({ Svg, title, description }) {
  if (!title) throw new Error('bye bye');

  // highlight-start
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
  // highlight-end
}
```

## **3. Show line numbers**

Use ```js showLineNumbers in the title, and the result would be:

```js showLineNumbers
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function FeatureCard({ Svg, title, description }) {
  if (!title) throw new Error('bye bye');

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
```

## **4. Syntax Highlight using showLineNumbers**

Instead of comments, you can add:

````md
```jsx {1,4-6,11} showLineNumbers
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function FeatureCard({ Svg, title, description }) {
  if (!title) throw new Error('bye bye');

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
```
````

And the result would be:

```js {1-2,5,8-16} showLineNumbers
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function FeatureCard({ Svg, title, description }) {
  if (!title) throw new Error('bye bye');

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
```

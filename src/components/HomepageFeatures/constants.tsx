import MountainSvg from '@site/static/img/undraw_docusaurus_mountain.svg';
import ReactSvg from '@site/static/img/undraw_docusaurus_react.svg';
import TreeSvg from '@site/static/img/undraw_docusaurus_tree.svg';

export const featureList = [
  {
    title: 'Easy to Use',
    Svg: MountainSvg,
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and used to get your website up and running
        quickly.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: TreeSvg,
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go ahead and move your docs into the{' '}
        <code>docs</code> directory.
      </>
    ),
  },
  {
    title: 'Powered by React',
    Svg: ReactSvg,
    description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can be extended while reusing the same
        header and footer.
      </>
    ),
  },
];

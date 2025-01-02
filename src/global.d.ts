declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '@docusaurus/*' {
  const content: any;

  export const translate: any;
  export default content;
}

declare module '@theme/*' {
  const content: any;

  export default content;
}

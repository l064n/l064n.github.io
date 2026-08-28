import type { ReactNode } from 'react';
import { Callout } from '@/components/mdx/Callout';
import { CustomCodeBlock } from '@/components/mdx/CustomCodeBlock';
import { AutoHeading } from '@/components/mdx/AutoHeading';

interface HeadingProps {
  children?: ReactNode;
}

/** MDX components map — injects custom Callout, CodeBlock, and anchor headings. */
export const mdxComponents = {
  Callout,
  CustomCodeBlock,
  h1: (props: HeadingProps) => <AutoHeading level={1}>{props.children}</AutoHeading>,
  h2: (props: HeadingProps) => <AutoHeading level={2}>{props.children}</AutoHeading>,
  h3: (props: HeadingProps) => <AutoHeading level={3}>{props.children}</AutoHeading>,
  h4: (props: HeadingProps) => <AutoHeading level={4}>{props.children}</AutoHeading>,
};

import React, { HTMLAttributes } from 'react';
import styles from '../../styles/Layout.module.css';

// 容器组件属性
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
  fluid?: boolean;
  className?: string;
  children: React.ReactNode;
}

// 容器组件
export const Container: React.FC<ContainerProps> = ({
  maxWidth = 'lg',
  padding = 'md',
  center = true,
  fluid = false,
  className,
  children,
  ...props
}) => {
  const containerClassName = [
    styles.container,
    fluid ? styles['container-fluid'] : styles[`container-${maxWidth}`],
    styles[`container-padding-${padding}`],
    center ? styles['container-center'] : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClassName} {...props}>
      {children}
    </div>
  );
};

// 网格系统属性
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  };
  className?: string;
  children: React.ReactNode;
}

// 网格容器组件
export const Grid: React.FC<GridProps> = ({
  columns = 12,
  gap = 'md',
  responsive,
  className,
  children,
  ...props
}) => {
  const gridClassName = [
    styles.grid,
    styles[`grid-cols-${columns}`],
    styles[`grid-gap-${gap}`],
    responsive?.sm ? styles[`grid-sm-cols-${responsive.sm}`] : '',
    responsive?.md ? styles[`grid-md-cols-${responsive.md}`] : '',
    responsive?.lg ? styles[`grid-lg-cols-${responsive.lg}`] : '',
    responsive?.xl ? styles[`grid-xl-cols-${responsive.xl}`] : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={gridClassName} {...props}>
      {children}
    </div>
  );
};

// 网格项属性
export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 'full';
  className?: string;
  children: React.ReactNode;
}

// 网格项组件
export const GridItem: React.FC<GridItemProps> = ({
  colSpan,
  rowSpan,
  className,
  children,
  ...props
}) => {
  const gridItemClassName = [
    styles['grid-item'],
    colSpan ? styles[`col-span-${colSpan}`] : '',
    rowSpan ? styles[`row-span-${rowSpan}`] : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={gridItemClassName} {...props}>
      {children}
    </div>
  );
};

// Flex布局属性
export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  wrap?: 'wrap' | 'nowrap';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
  children: React.ReactNode;
}

// Flex布局组件
export const Flex: React.FC<FlexProps> = ({
  direction = 'row',
  wrap = 'nowrap',
  justify = 'start',
  align = 'stretch',
  gap = 'none',
  className,
  children,
  ...props
}) => {
  const flexClassName = [
    styles.flex,
    styles[`flex-${direction}`],
    styles[`flex-${wrap}`],
    styles[`justify-${justify}`],
    styles[`items-${align}`],
    gap !== 'none' ? styles[`flex-gap-${gap}`] : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={flexClassName} {...props}>
      {children}
    </div>
  );
};

// 间距组件属性
export interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

// 间距组件
export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  direction = 'vertical',
  className,
}) => {
  const spacerClassName = [
    styles.spacer,
    styles[`spacer-${direction}`],
    styles[`spacer-${size}`],
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={spacerClassName} />;
};

export default {
  Container,
  Grid,
  GridItem,
  Flex,
  Spacer,
};

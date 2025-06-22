import React, { forwardRef, HTMLAttributes } from 'react';
import '@/styles/Card.css';

// 卡片变体类型
export type CardVariant = 'default' | 'outlined' | 'elevated' | 'filled';

// 卡片尺寸类型
export type CardSize = 'sm' | 'md' | 'lg';

// 基础卡片属性
export interface BaseCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  hoverable?: boolean;
  clickable?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

// 获取卡片变体样式类名
const getVariantClassName = (variant: CardVariant): string => {
  const variants = {
    default: 'card-default',
    outlined: 'card-outlined',
    elevated: 'card-elevated',
    filled: 'card-filled',
  };
  return variants[variant];
};

// 获取卡片尺寸样式类名
const getSizeClassName = (size: CardSize): string => {
  const sizes = {
    sm: 'card-sm',
    md: 'card-md',
    lg: 'card-lg',
  };
  return sizes[size];
};

// 基础卡片组件
export const Card = forwardRef<HTMLDivElement, BaseCardProps>(
  (
    {
      variant = 'default',
      size = 'md',
      hoverable = false,
      clickable = false,
      loading = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const cardClassName = [
      'card',
      getVariantClassName(variant),
      getSizeClassName(size),
      hoverable ? 'card-hoverable' : '',
      clickable ? 'card-clickable' : '',
      loading ? 'card-loading' : '',
      className || '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={cardClassName}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {loading && (
          <div className="card-loading-overlay">
            <div className="card-loading-spinner" />
          </div>
        )}

        {children}

        {/*
        Card styles have been moved to CSS files for better maintainability.
        The following CSS classes should be defined in your stylesheet:
        - .card, .card-loading, .card-loading-overlay, .card-loading-spinner
        - .card-sm, .card-md, .card-lg (size variants)
        - .card-default, .card-outlined, .card-elevated, .card-filled (style variants)
        - .card-hoverable, .card-clickable (interaction states)
        - @keyframes spin animation for loading spinner
      */}
      </div>
    );
  }
);

Card.displayName = 'Card';

// 卡片头部组件
export interface CardHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  avatar?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  avatar,
  className,
  children,
}) => {
  const headerClassName = ['card-header', className || '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={headerClassName}>
      {avatar && <div className="card-header-avatar">{avatar}</div>}

      <div className="card-header-content">
        {title && <div className="card-header-title">{title}</div>}
        {subtitle && <div className="card-header-subtitle">{subtitle}</div>}
        {children}
      </div>

      {action && <div className="card-header-action">{action}</div>}

      {/* CardHeader styles should be defined in CSS files */}
    </div>
  );
};

// 卡片内容组件
export interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({
  className,
  children,
}) => {
  const contentClassName = ['card-content', className || '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={contentClassName}>
      {children}

      {/* CardContent styles should be defined in CSS files */}
    </div>
  );
};

// 卡片底部组件
export interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

export const CardFooter: React.FC<CardFooterProps> = ({
  className,
  children,
  justify = 'end',
}) => {
  const footerClassName = [
    'card-footer',
    `card-footer-${justify}`,
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={footerClassName}>
      {children}

      {/* CardFooter styles should be defined in CSS files */}
    </div>
  );
};

// 卡片媒体组件
export interface CardMediaProps {
  src: string;
  alt: string;
  height?: string | number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  className?: string;
}

export const CardMedia: React.FC<CardMediaProps> = ({
  src,
  alt,
  height = 200,
  objectFit = 'cover',
  className,
}) => {
  const mediaClassName = ['card-media', className || '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={mediaClassName}>
      <img
        src={src}
        alt={alt}
        className="card-media-image"
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          objectFit,
        }}
      />

      {/* CardMedia styles should be defined in CSS files */}
    </div>
  );
};

// 卡片分隔线组件
export interface CardDividerProps {
  className?: string;
  margin?: 'none' | 'sm' | 'md' | 'lg';
}

export const CardDivider: React.FC<CardDividerProps> = ({
  className,
  margin = 'md',
}) => {
  const dividerClassName = [
    'card-divider',
    `card-divider-margin-${margin}`,
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <hr className={dividerClassName}>
      {/* CardDivider styles should be defined in CSS files */}
    </hr>
  );
};

// 卡片网格组件
export interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = 3,
  gap = 'md',
  className,
}) => {
  const gridClassName = [
    'card-grid',
    `card-grid-cols-${columns}`,
    `card-grid-gap-${gap}`,
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={gridClassName}>
      {children}

      {/* CardGrid styles should be defined in CSS files */}
    </div>
  );
};

export default {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardMedia,
  CardDivider,
  CardGrid,
};

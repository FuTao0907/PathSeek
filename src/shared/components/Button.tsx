import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import '@/styles/Button.css';

// 按钮变体类型
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning';

// 按钮尺寸类型
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 按钮属性接口
export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// 获取按钮变体样式类名
const getVariantClassName = (variant: ButtonVariant): string => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    success: 'btn-success',
    warning: 'btn-warning',
  };
  return variants[variant];
};

// 获取按钮尺寸样式类名
const getSizeClassName = (size: ButtonSize): string => {
  const sizes = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl',
  };
  return sizes[size];
};

// 加载图标组件
const LoadingIcon: React.FC<{ size: ButtonSize }> = ({ size }) => {
  const iconSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  }[size];

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      className="btn-loading-icon"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="31.416"
        strokeDashoffset="31.416"
      />
    </svg>
  );
};

// 按钮组件
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const buttonClassName = [
      'btn',
      getVariantClassName(variant),
      getSizeClassName(size),
      fullWidth ? 'btn-full-width' : '',
      loading ? 'btn-loading' : '',
      isDisabled ? 'btn-disabled' : '',
      className || '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={buttonClassName}
        {...props}
      >
        {loading && <LoadingIcon size={size} />}
        {!loading && leftIcon && (
          <span className="btn-icon btn-icon-left">{leftIcon}</span>
        )}

        <span className="btn-content">{children}</span>

        {!loading && rightIcon && (
          <span className="btn-icon btn-icon-right">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// 图标按钮组件
export interface IconButtonProps
  extends Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'ghost', size = 'md', className, ...props }, ref) => {
    const iconButtonClassName = ['btn-icon-only', className || '']
      .filter(Boolean)
      .join(' ');

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={iconButtonClassName}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

// 按钮组组件
export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'none',
  className,
}) => {
  const groupClassName = [
    'btn-group',
    `btn-group-${orientation}`,
    spacing !== 'none' ? `btn-group-spacing-${spacing}` : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={groupClassName}>{children}</div>;
};

export default {
  Button,
  IconButton,
  ButtonGroup,
};

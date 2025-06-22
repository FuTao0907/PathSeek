import React, { forwardRef } from 'react';
import styles from '../../styles/Form.module.css';

// 基础输入组件属性
export interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

// 文本输入组件
export interface TextInputProps extends BaseInputProps {
  type?: 'text' | 'email' | 'password' | 'url' | 'tel';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      disabled,
      className,
      id,
      type = 'text',
      value,
      onChange,
      placeholder,
      maxLength,
      minLength,
      pattern,
      autoComplete,
      autoFocus,
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    return (
      <div className={`${styles['form-field']} ${className || ''}`}>
        {label && (
          <label htmlFor={inputId} className={styles['form-label']}>
            {label}
            {required && <span className={styles['form-required']}>*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          required={required}
          disabled={disabled}
          className={`${styles['form-input']} ${hasError ? styles['form-input-error'] : ''}`}
          aria-invalid={hasError}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
        />

        {error && (
          <div
            id={`${inputId}-error`}
            className={styles['form-error']}
            role="alert"
          >
            {error}
          </div>
        )}

        {helperText && !error && (
          <div id={`${inputId}-helper`} className={styles['form-helper']}>
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

// 文本域组件
export interface TextareaProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  minLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autoFocus?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      disabled,
      className,
      id,
      value,
      onChange,
      placeholder,
      rows = 4,
      maxLength,
      minLength,
      resize = 'vertical',
      autoFocus,
    },
    ref
  ) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    return (
      <div className={`${styles['form-field']} ${className || ''}`}>
        {label && (
          <label htmlFor={inputId} className={styles['form-label']}>
            {label}
            {required && <span className={styles['form-required']}>*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          minLength={minLength}
          autoFocus={autoFocus}
          required={required}
          disabled={disabled}
          className={`${styles['form-textarea']} ${hasError ? styles['form-input-error'] : ''}`}
          style={{ resize }}
          aria-invalid={hasError}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
        />

        {error && (
          <div
            id={`${inputId}-error`}
            className={styles['form-error']}
            role="alert"
          >
            {error}
          </div>
        )}

        {helperText && !error && (
          <div id={`${inputId}-helper`} className={styles['form-helper']}>
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// 选择框组件
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  multiple?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      disabled,
      className,
      id,
      value,
      onChange,
      options,
      placeholder,
      multiple,
    },
    ref
  ) => {
    const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    return (
      <div className={`${styles['form-field']} ${className || ''}`}>
        {label && (
          <label htmlFor={inputId} className={styles['form-label']}>
            {label}
            {required && <span className={styles['form-required']}>*</span>}
          </label>
        )}

        <div className={styles['form-select-wrapper']}>
          <select
            ref={ref}
            id={inputId}
            value={value}
            onChange={e => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            multiple={multiple}
            className={`${styles['form-select']} ${hasError ? styles['form-input-error'] : ''}`}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map(option => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {!multiple && (
            <div className={styles['form-select-icon']}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </div>
          )}
        </div>

        {error && (
          <div
            id={`${inputId}-error`}
            className={styles['form-error']}
            role="alert"
          >
            {error}
          </div>
        )}

        {helperText && !error && (
          <div id={`${inputId}-helper`} className={styles['form-helper']}>
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// 复选框组件
export interface CheckboxProps extends Omit<BaseInputProps, 'error'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      required,
      disabled,
      className,
      id,
      checked,
      onChange,
      indeterminate,
    },
    ref
  ) => {
    const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`${styles['form-checkbox-field']} ${className || ''}`}>
        <div className={styles['form-checkbox-wrapper']}>
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            onChange={e => onChange(e.target.checked)}
            required={required}
            disabled={disabled}
            className={styles['form-checkbox']}
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
          />

          <div
            className={`${styles['form-checkbox-indicator']} ${indeterminate ? styles['indeterminate'] : ''}`}
          >
            {checked && !indeterminate && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
            )}
            {indeterminate && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </div>

          {label && (
            <label htmlFor={inputId} className={styles['form-checkbox-label']}>
              {label}
              {required && <span className={styles['form-required']}>*</span>}
            </label>
          )}
        </div>

        {helperText && (
          <div id={`${inputId}-helper`} className={styles['form-helper']}>
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// 单选框组件
export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  name: string;
  direction?: 'horizontal' | 'vertical';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  error,
  helperText,
  required,
  disabled,
  className,
  id,
  value,
  onChange,
  options,
  name,
  direction = 'vertical',
}) => {
  const groupId =
    id || `radio-group-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${styles['form-field']} ${className || ''}`}>
      {label && (
        <div
          className={styles['form-label']}
          role="group"
          aria-labelledby={`${groupId}-label`}
        >
          <span id={`${groupId}-label`}>
            {label}
            {required && <span className={styles['form-required']}>*</span>}
          </span>
        </div>
      )}

      <div
        className={`${styles['form-radio-group']} ${styles[`form-radio-group-${direction}`]}`}
      >
        {options.map((option, index) => {
          const optionId = `${groupId}-option-${index}`;
          return (
            <div key={option.value} className={styles['form-radio-wrapper']}>
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={e => onChange(e.target.value)}
                required={required}
                disabled={disabled || option.disabled}
                className={styles['form-radio']}
                aria-describedby={
                  error
                    ? `${groupId}-error`
                    : helperText
                      ? `${groupId}-helper`
                      : undefined
                }
              />

              <div className={styles['form-radio-indicator']} />

              <label htmlFor={optionId} className={styles['form-radio-label']}>
                {option.label}
              </label>
            </div>
          );
        })}
      </div>

      {error && (
        <div
          id={`${groupId}-error`}
          className={styles['form-error']}
          role="alert"
        >
          {error}
        </div>
      )}

      {helperText && !error && (
        <div id={`${groupId}-helper`} className={styles['form-helper']}>
          {helperText}
        </div>
      )}
    </div>
  );
};

// 表单组件
export interface FormProps {
  children: React.ReactNode;
  onSubmit?: (event: React.FormEvent) => void;
  className?: string;
  noValidate?: boolean;
}

export const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  className,
  noValidate = true,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    if (onSubmit) {
      event.preventDefault();
      onSubmit(event);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className} noValidate={noValidate}>
      {children}
    </form>
  );
};

export default {
  Form,
  TextInput,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
};

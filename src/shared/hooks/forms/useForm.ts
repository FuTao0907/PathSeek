import { useState, useCallback } from 'react';
import { ApiResponse, FormState, ValidationError } from '@/shared/types';

/**
 * 表单管理 Hook
 * @param initialValues - 表单初始值
 * @param validate - 验证函数
 * @returns 表单状态和操作方法
 * @example
 * ```tsx
 * const {
 *   data,
 *   errors,
 *   isSubmitting,
 *   isValid,
 *   setValue,
 *   setValues,
 *   validateForm,
 *   reset,
 *   handleSubmit
 * } = useForm(
 *   { email: '', password: '' },
 *   (values) => {
 *     const errors = [];
 *     if (!values.email) errors.push({ field: 'email', message: 'Email is required' });
 *     return errors;
 *   }
 * );
 * ```
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => ValidationError[]
) {
  const [formState, setFormState] = useState<FormState<T>>({
    data: initialValues,
    errors: [],
    isSubmitting: false,
    isValid: true,
  });

  const setValue = useCallback((field: keyof T, value: any) => {
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value },
    }));
  }, []);

  const setValues = useCallback((values: Partial<T>) => {
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, ...values },
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (!validate) return true;

    const errors = validate(formState.data);
    setFormState(prev => ({
      ...prev,
      errors,
      isValid: errors.length === 0,
    }));

    return errors.length === 0;
  }, [formState.data, validate]);

  const reset = useCallback(() => {
    setFormState({
      data: initialValues,
      errors: [],
      isSubmitting: false,
      isValid: true,
    });
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (onSubmit: (data: T) => Promise<ApiResponse>) => {
      if (!validateForm()) return;

      setFormState(prev => ({ ...prev, isSubmitting: true }));

      try {
        const response = await onSubmit(formState.data);
        if (response.success) {
          reset();
        }
        return response;
      } catch (error) {
        return { success: false, error: 'Submission failed' };
      } finally {
        setFormState(prev => ({ ...prev, isSubmitting: false }));
      }
    },
    [formState.data, validateForm, reset]
  );

  return {
    ...formState,
    setValue,
    setValues,
    validateForm,
    reset,
    handleSubmit,
  };
}

export default useForm;
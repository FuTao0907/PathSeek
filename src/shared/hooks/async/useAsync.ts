import { useState, useEffect } from 'react';
import * as React from 'react';

/**
 * 异步操作状态
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * 异步操作 Hook
 * @param asyncFunction - 异步函数
 * @param dependencies - 依赖数组
 * @returns 异步操作的状态
 * @example
 * ```tsx
 * const { data, loading, error } = useAsync(
 *   () => fetchUserData(userId),
 *   [userId]
 * );
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * return <div>{data?.name}</div>;
 * ```
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = []
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    setState({ data: null, loading: true, error: null });

    asyncFunction()
      .then(data => {
        if (isMounted) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch(error => {
        if (isMounted) {
          setState({ data: null, loading: false, error });
        }
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncFunction, ...dependencies]);

  return state;
}

export default useAsync;
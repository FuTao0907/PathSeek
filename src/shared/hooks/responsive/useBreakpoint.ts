import { useMemo } from 'react';
import { useMediaQuery } from './useMediaQuery';

/**
 * 断点类型
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * 断点状态
 */
export interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  current: Breakpoint;
}

/**
 * 响应式断点 Hook
 * @returns 当前断点状态
 * @example
 * ```tsx
 * const { isMobile, isTablet, isDesktop, current } = useBreakpoint();
 * 
 * return (
 *   <div>
 *     <p>当前断点: {current}</p>
 *     {isMobile && <MobileComponent />}
 *     {isTablet && <TabletComponent />}
 *     {isDesktop && <DesktopComponent />}
 *   </div>
 * );
 * ```
 */
export function useBreakpoint(): BreakpointState {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return useMemo(
    () => ({
      isMobile,
      isTablet,
      isDesktop,
      current: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
    }),
    [isMobile, isTablet, isDesktop]
  );
}

export default useBreakpoint;
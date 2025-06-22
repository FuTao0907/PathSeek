import { useState, useEffect } from 'react';

/**
 * 滚动位置 Hook
 * @returns 当前滚动位置（Y轴）
 * @example
 * ```tsx
 * const scrollPosition = useScrollPosition();
 * 
 * return (
 *   <div>
 *     <p>滚动位置: {scrollPosition}px</p>
 *     {scrollPosition > 100 && (
 *       <button onClick={() => window.scrollTo(0, 0)}>
 *         回到顶部
 *       </button>
 *     )}
 *   </div>
 * );
 * ```
 */
export function useScrollPosition(): number {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll', updatePosition);
    updatePosition();

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
}

export default useScrollPosition;
'use client'

import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions extends IntersectionObserverInit {
  unobserveOnEnter?: boolean; // If true, the observer will unobserve the target once it enters the viewport
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const { threshold = 0.1, root = null, rootMargin = '0px', unobserveOnEnter = true } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (unobserveOnEnter) {
            observer.unobserve(entry.target);
          }
        } else if (!unobserveOnEnter) {
          // If not unobserving, set to false when out of view
          setInView(false);
        }
      },
      { threshold, root, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, root, rootMargin, unobserveOnEnter]);

  return [ref, inView] as const;
}

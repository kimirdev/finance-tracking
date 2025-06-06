import { useEffect, useState } from 'react';

export type UseMediaQueryOptions = {
  minWidth?: number;
  maxWidth?: number;
  orientation?: 'portrait' | 'landscape';
};

function buildMediaQuery(options: UseMediaQueryOptions): string {
  const parts: string[] = [];
  if (options.minWidth !== undefined) parts.push(`(min-width: ${options.minWidth}px)`);
  if (options.maxWidth !== undefined) parts.push(`(max-width: ${options.maxWidth}px)`);
  if (options.orientation) parts.push(`(orientation: ${options.orientation})`);
  return parts.join(' and ');
}

export function useMediaQuery(options: UseMediaQueryOptions): boolean {
  const query = buildMediaQuery(options);
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
    // eslint-disable-next-line
  }, [query]);

  return matches;
} 
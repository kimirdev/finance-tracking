import { cn } from '../utils';

describe('cn', () => {
  it('should merge simple class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
  });

  it('should handle arrays of class names', () => {
    expect(cn('class1', ['class2', 'class3'])).toBe('class1 class2 class3');
  });

  it('should handle mixed inputs', () => {
    expect(cn('class1', ['class2', true && 'class3'], false && 'class4', 'class5')).toBe('class1 class2 class3 class5');
  });

  it('should override conflicting tailwind classes', () => {
    // twMerge specific test
    expect(cn('p-4', 'p-8')).toBe('p-8');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should handle empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('class1', null, undefined, '')).toBe('class1');
  });
}); 
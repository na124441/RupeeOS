import gsap from 'gsap';
import { isReducedMotion } from './reducedMotion';
import { formatRupee } from '../../utils/currency';

interface CountUpOptions {
  duration?: number;
  prefix?: string;
  suffix?: string;
  isCurrency?: boolean;
  onUpdate?: (formattedValue: string) => void;
}

export function animateCount(
  targetValue: number,
  initialValue: number = 0,
  options: CountUpOptions = {}
): { kill: () => void } {
  const {
    duration = 0.85,
    prefix = '',
    suffix = '',
    isCurrency = true,
    onUpdate,
  } = options;

  if (isReducedMotion()) {
    if (onUpdate) {
      onUpdate(isCurrency ? formatRupee(targetValue) : `${prefix}${Math.round(targetValue)}${suffix}`);
    }
    return { kill: () => {} };
  }

  const state = { value: initialValue };

  const tween = gsap.to(state, {
    value: targetValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      const current = Math.round(state.value);
      if (onUpdate) {
        onUpdate(isCurrency ? formatRupee(current) : `${prefix}${current}${suffix}`);
      }
    },
  });

  return {
    kill: () => tween.kill(),
  };
}

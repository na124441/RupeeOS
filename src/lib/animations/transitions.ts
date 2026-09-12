import gsap from 'gsap';
import { isReducedMotion } from './reducedMotion';

export function animateTabTransition(containerElement: HTMLElement | null): void {
  if (!containerElement || isReducedMotion()) return;

  gsap.fromTo(
    containerElement,
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' }
  );
}

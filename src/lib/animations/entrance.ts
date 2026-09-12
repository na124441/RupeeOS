import gsap from 'gsap';
import { isReducedMotion } from './reducedMotion';

export function animatePageEntrance(containerElement: HTMLElement | null): gsap.core.Timeline | null {
  if (!containerElement || isReducedMotion()) return null;

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  // 1. Container fade in
  tl.fromTo(
    containerElement,
    { opacity: 0 },
    { opacity: 1, duration: 0.25 }
  );

  // 2. Hero & Balance element
  const hero = containerElement.querySelector('[data-animate="hero"]');
  if (hero) {
    tl.fromTo(
      hero,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35 },
      '-=0.15'
    );
  }

  // 3. Staggered Financial Cards
  const cards = containerElement.querySelectorAll('[data-animate="card"]');
  if (cards.length > 0) {
    tl.fromTo(
      cards,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 },
      '-=0.2'
    );
  }

  // 4. Charts / Visualizations
  const charts = containerElement.querySelectorAll('[data-animate="chart"]');
  if (charts.length > 0) {
    tl.fromTo(
      charts,
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.35, stagger: 0.08 },
      '-=0.15'
    );
  }

  return tl;
}

export function animateModalEnter(modalElement: HTMLElement | null, backdropElement: HTMLElement | null): void {
  if (isReducedMotion()) return;

  if (backdropElement) {
    gsap.fromTo(backdropElement, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.out' });
  }
  if (modalElement) {
    gsap.fromTo(
      modalElement,
      { opacity: 0, y: 16, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out' }
    );
  }
}

export function animateSheetEnter(sheetElement: HTMLElement | null): void {
  if (!sheetElement || isReducedMotion()) return;
  gsap.fromTo(
    sheetElement,
    { y: '100%' },
    { y: '0%', duration: 0.32, ease: 'power3.out' }
  );
}

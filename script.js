/* ─────────────────────────────────────────────────────
   script.js — Portfolio Interactions
   Sections:
     1. Scroll Reveal
     2. Active Nav Highlight
───────────────────────────────────────────────────── */


/* ─── 1. Scroll Reveal ─────────────────────────────── *
 *
 * Watches every .reveal element. When one enters the
 * viewport, adds the .in class to trigger its CSS
 * fade-up transition. Siblings stagger slightly so
 * elements in the same section don't all pop in at once.
 *
 * ───────────────────────────────────────────────────── */

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Stagger siblings that haven't animated yet
    const siblings = [
      ...entry.target.parentElement.querySelectorAll('.reveal:not(.in)')
    ];
    const delay = siblings.indexOf(entry.target) * 60;

    setTimeout(() => entry.target.classList.add('in'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ─── 2. Active Nav Highlight ──────────────────────── *
 *
 * Watches each section. When a section is roughly
 * centred in the viewport, highlights its matching
 * nav link by setting its colour to --ink.
 * Resets all other links first so only one is active.
 *
 * ───────────────────────────────────────────────────── */

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Clear all active styles
    document.querySelectorAll('.nav-links a').forEach(a => a.style.color = '');

    // Highlight the matching link
    const activeLink = document.querySelector(
      `.nav-links a[href="#${entry.target.id}"]`
    );
    if (activeLink) activeLink.style.color = 'var(--ink)';
  });
}, { rootMargin: '-30% 0px -60% 0px' });

document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));

/* ─────────────────────────────────────────────────────
   script.js — Portfolio Interactions
   Sections:
     1. Hero Terminal (typewriter, replayable)
     2. Scroll Reveal
     3. Active Nav Highlight
     4. Copy Email
───────────────────────────────────────────────────── */


/* ─── 1. Hero Terminal ─────────────────────────────── *
 *
 * Types out a short intro line by line, like a terminal
 * session. Respects prefers-reduced-motion (renders
 * instantly instead of animating). Click or press Enter/
 * Space on the terminal to replay it.
 *
 * ───────────────────────────────────────────────────── */

const TERMINAL_LINES = [
  { prompt: true,  text: 'whoami' },
  { prompt: false, text: 'Dong Kyu Lim — backend engineer, Seattle' },
  { prompt: true,  text: 'status --check' },
  { prompt: false, text: 'open to work · self-hosted on a Raspberry Pi', cursor: true },
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function renderTerminalInstantly(body) {
  body.innerHTML = '';
  TERMINAL_LINES.forEach(line => {
    const p = document.createElement('p');
    p.className = 'terminal-line' + (line.prompt ? '' : ' out');
    if (line.prompt) {
      const span = document.createElement('span');
      span.className = 'prompt';
      span.textContent = '$';
      p.appendChild(span);
      p.appendChild(document.createTextNode(line.text));
    } else {
      p.textContent = line.text;
      if (line.cursor) {
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        p.appendChild(cursor);
      }
    }
    body.appendChild(p);
  });
}

async function typeTerminal(body) {
  if (prefersReducedMotion) {
    renderTerminalInstantly(body);
    return;
  }

  body.innerHTML = '';

  for (const line of TERMINAL_LINES) {
    const p = document.createElement('p');
    p.className = 'terminal-line' + (line.prompt ? '' : ' out');
    body.appendChild(p);

    let prefix = null;
    if (line.prompt) {
      prefix = document.createElement('span');
      prefix.className = 'prompt';
      prefix.textContent = '$';
      p.appendChild(prefix);
    }

    const textNode = document.createTextNode('');
    p.appendChild(textNode);

    const speed = line.prompt ? 45 : 22;
    for (let i = 0; i < line.text.length; i++) {
      textNode.textContent += line.text[i];
      await new Promise(r => setTimeout(r, speed));
    }

    if (line.cursor) {
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      p.appendChild(cursor);
    }

    await new Promise(r => setTimeout(r, line.prompt ? 120 : 260));
  }
}

const heroTerminal = document.getElementById('heroTerminal');
const terminalBody = document.getElementById('terminalBody');
let terminalPlaying = false;

async function playTerminal() {
  if (terminalPlaying) return;
  terminalPlaying = true;
  await typeTerminal(terminalBody);
  terminalPlaying = false;
}

if (heroTerminal && terminalBody) {
  playTerminal();

  heroTerminal.addEventListener('click', playTerminal);
  heroTerminal.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playTerminal();
    }
  });
}


/* ─── 2. Scroll Reveal ─────────────────────────────── *
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

    const siblings = [
      ...entry.target.parentElement.querySelectorAll('.reveal:not(.in)')
    ];
    const delay = siblings.indexOf(entry.target) * 60;

    setTimeout(() => entry.target.classList.add('in'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ─── 3. Active Nav Highlight ──────────────────────── *
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

    document.querySelectorAll('.nav-links a').forEach(a => a.style.color = '');

    const activeLink = document.querySelector(
      `.nav-links a[href="#${entry.target.id}"]`
    );
    if (activeLink) activeLink.style.color = 'var(--ink)';
  });
}, { rootMargin: '-30% 0px -60% 0px' });

document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));


/* ─── 4. Copy Email ────────────────────────────────── *
 *
 * Copies the contact email to the clipboard and shows a
 * brief confirmation message.
 *
 * ───────────────────────────────────────────────────── */

const copyBtn = document.getElementById('copyEmailBtn');
const copyMsg = document.getElementById('copyMsg');

if (copyBtn && copyMsg) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('limjustin2@gmail.com');
      copyMsg.classList.add('show');
      setTimeout(() => copyMsg.classList.remove('show'), 1800);
    } catch (e) {
      // Clipboard API unavailable - fail silently, mailto button still works
    }
  });
}
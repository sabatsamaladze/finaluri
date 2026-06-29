/* ===================================
   TBILISI BITES — stats.js
   Animates counter numbers on scroll
=================================== */

document.addEventListener('DOMContentLoaded', () => {
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (!statNums.length) return;

  function animateCount(el, target, duration = 1800) {
    const start = performance.now();
    const isLarge = target > 999;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);

      el.textContent = isLarge
        ? current.toLocaleString('ka-GE')
        : current;

      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = isLarge ? target.toLocaleString('ka-GE') : target;
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCount(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
});
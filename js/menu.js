/* ===================================
   TBILISI BITES — menu.js
   Category filter with animation
=================================== */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item[data-cat]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      menuItems.forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.classList.remove('hidden');
          // Re-trigger animation
          item.style.animation = 'none';
          item.offsetHeight; // force reflow
          item.style.animation = '';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
});
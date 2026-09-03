/* Journey map: click hub to expand, click substop to jump. */
(function journey() {
  const hubs = $$('.journey-hub');
  if (!hubs.length) return;
  $$('.journey-hub-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const hub = btn.closest('.journey-hub');
      const open = hub.classList.contains('is-open');
      hubs.forEach(h => h.classList.remove('is-open'));
      if (!open) hub.classList.add('is-open');
    });
  });
  $$('.journey-substop').forEach(btn => {
    btn.addEventListener('click', () => {
      const el = document.getElementById(btn.dataset.sec);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

/* Shared reading-page controls. Content and navigation work without JavaScript. */
const themeButton = document.getElementById('themeToggle');
try {
  const saved = localStorage.getItem('k8s-study-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
} catch (_) { /* Storage may be unavailable in private browsing. */ }
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('k8s-study-theme', theme); } catch (_) {}
});
document.querySelector('[data-copy-code]')?.addEventListener('click', async () => {
  const status = document.getElementById('copyStatus');
  try {
    await navigator.clipboard.writeText(document.querySelector('pre code').textContent);
    status.textContent = 'YAML copied';
  } catch (_) {
    status.textContent = 'Copy unavailable. Select the YAML or download the file.';
  }
});

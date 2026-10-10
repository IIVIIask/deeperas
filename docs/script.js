document.querySelectorAll('[data-copy-target]').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(target.textContent.trim());
      status.textContent = 'Copied. Paste it into your assistant or terminal.';
      const label = button.textContent;
      button.textContent = 'Copied ✓';
      setTimeout(() => { button.textContent = label; }, 2000);
    } catch {
      status.textContent = 'Clipboard access is unavailable. Select and copy the text below.';
      target.hidden = false;
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(target);
      selection.removeAllRanges();
      selection.addRange(range);
      target.scrollIntoView({ block: 'nearest' });
    }
  });
});

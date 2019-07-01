export function disActiveNode () {
  for (let contentEl of document.querySelectorAll('svg .content')) {
    contentEl.classList.remove('active')
  }
}

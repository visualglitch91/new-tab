export function focusOnRef(inputElement: HTMLInputElement) {
  if (!inputElement) return;

  setTimeout(() => {
    inputElement.focus();
  }, 50);
}

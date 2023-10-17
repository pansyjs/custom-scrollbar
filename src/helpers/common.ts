export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export function getElementWindow(element: Element) {
  if (
    !element ||
    !element.ownerDocument ||
    !element.ownerDocument.defaultView
  ) {
    return window;
  }
  return element.ownerDocument.defaultView;
}

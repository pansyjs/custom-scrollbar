export function addClasses(el: HTMLElement | null, classes: string) {
  if (!el) return;
  el.classList.add(...classes.split(' '));
}

export function removeClasses(el: HTMLElement | null, classes: string) {
  if (!el) return;
  classes.split(' ').forEach((className) => {
    el.classList.remove(className);
  });
}

export function classNamesToQuery(classNames: string) {
  return `.${classNames.split(' ').join('.')}`;
}

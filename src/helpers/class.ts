export function classNamesToQuery(classNames: string) {
  return `.${classNames.split(' ').join('.')}`;
}

export function cx(...classNames: (string | null | undefined | false | 0)[]) {
  return classNames.filter(Boolean).join(" ");
}

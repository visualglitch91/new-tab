import parse from "./parse";
import astish from "./astish";
import { uniqueClassName } from "./utils";

export function appendStyle(style: string) {
  const tag = document.createElement("style");
  tag.innerHTML = style;
  document.head.appendChild(tag);
}

function compile(
  parseAST: (ast: any, className: string) => any,
  strings: any[],
  values: any[]
) {
  const className = uniqueClassName();

  const evaluated = strings
    .reduce((acc, string, i) => {
      acc.push(string);
      if (values[i]) acc.push(values[i].toString());

      return acc;
    }, [])
    .join("");

  const style = parse(parseAST(astish(evaluated), className), "." + className);
  appendStyle(style);

  return className;
}

export function css(...args: any[]) {
  const [strings, ...values] = args;
  return compile((it) => it, strings, values);
}

export function keyframes(...args: any[]) {
  const [strings, ...values] = args;
  return compile(
    (it, className) => ({ ["@keyframes " + className]: it }),
    strings,
    values
  );
}

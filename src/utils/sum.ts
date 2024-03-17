export function sum(a: number, b: number) {
  return a + b;
}

export function add(...args: number[]) {
  return args.reduce((a, b) => a + b, 0);
}

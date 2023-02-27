export function on(
  obj: any,
  ev: string,
  fn: (err?: any) => any
): VoidFunction {
  obj.on(ev, fn);
  return function subDestroy(): void {
    obj.off(ev, fn);
  };
}

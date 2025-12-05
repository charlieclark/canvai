export function convertAspectRatioString(ar: string) {
  const [w, h] = ar.split(":").map((n) => parseInt(n));
  return w! / h!;
}

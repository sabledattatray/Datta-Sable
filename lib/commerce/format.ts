export function money(minor: number, currency: string) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(minor / 100);
}

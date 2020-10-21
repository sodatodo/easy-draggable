export function isNum(num: any): boolean {
  return typeof num === 'number' && !Number.isNaN(num);
}

export function int(value:string): number {
  return parseInt(value, 10);
}

export default {};

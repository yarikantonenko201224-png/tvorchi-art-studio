/* Украинские числительные: 1 заняття · 2 заняття · 5 занять.
   Без этого сайт говорит «21 майстер-класів» — носитель спотыкается сразу. */
export function plural(n: number, one: string, few: string, many: string): string {
  const mod100 = Math.abs(n) % 100;
  const mod10 = mod100 % 10;
  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

export function lessonsWord(n: number): string {
  return plural(n, 'заняття', 'заняття', 'занять');
}

export function masterClassesWord(n: number): string {
  return plural(n, 'майстер-клас', 'майстер-класи', 'майстер-класів');
}

export function childrenWord(n: number): string {
  return plural(n, 'дитина', 'дитини', 'дітей');
}

export function placesWord(n: number): string {
  return plural(n, 'вільне місце', 'вільні місця', 'вільних місць');
}

export function peopleWord(n: number): string {
  return plural(n, 'людина', 'людини', 'людей');
}

/* Украинский номер: показываем в привычном виде и не даём ввести лишнее. */
export function formatPhone(value: string): string {
  let d = value.replace(/\D/g, '');
  if (d.startsWith('380')) d = d.slice(3);
  if (d.startsWith('0')) d = d.slice(1);
  d = d.slice(0, 9);
  let out = '+380';
  if (d.length) out += ' ' + d.slice(0, 2);
  if (d.length > 2) out += ' ' + d.slice(2, 5);
  if (d.length > 5) out += ' ' + d.slice(5, 7);
  if (d.length > 7) out += ' ' + d.slice(7, 9);
  return out;
}

export function isPhoneComplete(value: string): boolean {
  return value.replace(/\D/g, '').length === 12;
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

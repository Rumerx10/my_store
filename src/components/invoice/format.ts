import type { InvoiceAddress } from './types';

// Amounts as printed: taka with ৳, any other currency with its code.
export const money = (amount: number, currency: string) => {
  const text = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${amount < 0 ? '−' : ''}${currency === 'BDT' ? '৳' : `${currency} `}${text}`;
};

// Whole amounts for the courier label, where paisa only get in the way: "৳12,500".
export const wholeMoney = (amount: number, currency: string) =>
  `${currency === 'BDT' ? '৳' : `${currency} `}${Math.round(amount).toLocaleString('en-US')}`;

// "+8801712345678" -> "01712-345678", the way numbers are written and dialled in Bangladesh.
// Anything that isn't a Bangladeshi number is printed as it was given.
export const localPhone = (phone: string) => {
  const digits = phone.replace(/[^\d]/g, '');
  const local = digits.startsWith('880') ? `0${digits.slice(3)}` : digits;
  return /^0\d{10}$/.test(local) ? `${local.slice(0, 5)}-${local.slice(5)}` : phone;
};

export const printedDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  });

// The area couriers sort parcels by, and the full address under it.
export const areaLine = (address: InvoiceAddress) => `${address.thana}, ${address.district}`;

export const streetLine = (address: InvoiceAddress) =>
  [address.addressLine, address.villageOrWard].filter(Boolean).join(', ');

export const fullAddress = (address: InvoiceAddress) =>
  `${streetLine(address)}, ${areaLine(address)}${address.postCode ? ` ${address.postCode}` : ''}`;

const ONES = [
  '',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const belowHundred = (n: number) =>
  n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? `-${ONES[n % 10]}` : ''}`;

const belowThousand = (n: number) =>
  [n >= 100 ? `${ONES[Math.floor(n / 100)]} hundred` : '', belowHundred(n % 100)]
    .filter(Boolean)
    .join(' ');

// Counted the South Asian way: crore (10,000,000), lakh (100,000), thousand, hundred.
const words = (n: number): string => {
  if (n === 0) return 'zero';
  const parts: string[] = [];
  const crore = Math.floor(n / 10_000_000);
  if (crore) parts.push(`${words(crore)} crore`);
  const lakh = Math.floor((n % 10_000_000) / 100_000);
  if (lakh) parts.push(`${belowHundred(lakh)} lakh`);
  const thousand = Math.floor((n % 100_000) / 1000);
  if (thousand) parts.push(`${belowHundred(thousand)} thousand`);
  if (n % 1000) parts.push(belowThousand(n % 1000));
  return parts.join(' ');
};

// "Two thousand nine hundred eighty-five taka and fifty paisa only".
export const amountInWords = (amount: number, currency: string) => {
  const cents = Math.round(Math.abs(amount) * 100);
  const whole = Math.floor(cents / 100);
  const fraction = cents % 100;
  const [unit, subunit] = currency === 'BDT' ? ['taka', 'paisa'] : [currency, 'cents'];
  const text = `${words(whole)} ${unit}${fraction ? ` and ${words(fraction)} ${subunit}` : ''} only`;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

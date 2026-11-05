import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Archivo, Hind_Siliguri } from 'next/font/google';
import InvoicesPrint from '@/components/admin/print/InvoicesPrint';

// Archivo's condensed widths set the label's routing details (area, phone, cash); Hind Siliguri
// prints addresses written in Bangla, and the ৳ sign. Both wait to load rather than print in a
// stand-in font.
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-invoice',
  display: 'block',
});
const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-invoice-bn',
  display: 'block',
});

export const metadata: Metadata = {
  title: 'Print invoices',
  robots: { index: false, follow: false },
};

// /next-power/print/invoices?ids=<id,id> or ?status=PROCESSING; &print=1 opens the print
// dialog once the sheets are ready.
const page = () => (
  <div className={`${archivo.variable} ${hindSiliguri.variable}`}>
    <Suspense>
      <InvoicesPrint />
    </Suspense>
  </div>
);

export default page;

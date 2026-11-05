import type { Metadata } from 'next';
import StorePicker from '@/components/admin/StorePicker';
import { SELLER_CENTRE_ICON_URL } from '@/lib/storeTheme';

export const metadata: Metadata = {
  title: 'Seller centre',
  robots: { index: false, follow: false },
  icons: { icon: SELLER_CENTRE_ICON_URL },
};

// /admin: pick the store to manage. Each store's seller centre is /admin/<store>.
const page = () => <StorePicker />;

export default page;

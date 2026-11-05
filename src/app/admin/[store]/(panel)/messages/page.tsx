import type { Metadata } from 'next';
import Messages from '@/components/admin/Messages';

export const metadata: Metadata = { title: 'Messages' };

const page = () => <Messages />;

export default page;

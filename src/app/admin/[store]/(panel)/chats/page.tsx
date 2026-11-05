import type { Metadata } from 'next';
import Chats from '@/components/admin/Chats';

export const metadata: Metadata = { title: 'Chats' };

const page = () => <Chats />;

export default page;

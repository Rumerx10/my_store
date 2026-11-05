import Image from 'next/image';
import { absoluteUrl } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import { ChatContact } from './chatData';

const ChatAvatar = ({ chat, size = 'md' }: { chat: ChatContact; size?: 'sm' | 'md' }) => (
  <span
    aria-hidden="true"
    className={cn(
      'relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-soft font-semibold text-brand-ink',
      size === 'sm' ? 'size-10 text-sm' : 'size-12',
    )}
  >
    {chat.avatarUrl ? (
      <Image
        src={absoluteUrl(chat.avatarUrl)}
        alt=""
        fill
        sizes="48px"
        unoptimized
        className="object-cover"
      />
    ) : (
      chat.initials
    )}
  </span>
);

export default ChatAvatar;

import { cn } from '@/lib/utils';
import { ChatContact } from './chatData';

const ChatAvatar = ({ chat, size = 'md' }: { chat: ChatContact; size?: 'sm' | 'md' }) => (
  <span className="relative shrink-0" aria-hidden="true">
    <span
      className={cn(
        'flex items-center justify-center rounded-xl bg-brand-soft font-semibold text-brand-ink',
        size === 'sm' ? 'size-10 text-sm' : 'size-12',
      )}
    >
      {chat.initials}
    </span>
    {chat.isOnline && (
      <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-green" />
    )}
  </span>
);

export default ChatAvatar;

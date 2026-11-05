'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { absoluteUrl } from '@/lib/api/client';
import { cn } from '@/lib/utils';

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

// A person's photo, or their initials when they have none.
const UserAvatar = ({
  name,
  avatarUrl,
  className,
}: {
  name: string;
  avatarUrl?: string | null;
  className?: string;
}) => (
  <Avatar className={cn('size-8', className)}>
    {avatarUrl && <AvatarImage src={absoluteUrl(avatarUrl)} alt="" className="object-cover" />}
    <AvatarFallback className="border-0 bg-brand-soft text-xs font-semibold text-brand">
      {initials(name)}
    </AvatarFallback>
  </Avatar>
);

export default UserAvatar;

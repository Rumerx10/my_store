import { useCart } from '@/lib/query/cart';
import { useChats } from '@/lib/query/admin';
import { useMyChat } from '@/lib/query/messages';
import { useSession } from '@/lib/query/session';
import { useCategories } from '@/lib/query/shop';
import { useWishlist } from '@/lib/query/wishlist';
import { adminHome } from '@/lib/stores';

export interface ShopLink {
  label: string;
  href: string;
  blurb?: string;
}

// What the header shows: counts, who is signed in, where the chat goes, and the shop links
// built from the store's categories.
export const useNavData = () => {
  const { user, isStaff } = useSession();
  const cartCount = useCart().data?.items.length ?? 0;
  const wishlistCount = useWishlist().data?.length ?? 0;
  const customerChat = useMyChat({ open: false }).data?.unread ?? 0;
  const staffChats = useChats({ interval: 60_000 }).data?.unread ?? 0;
  const { data: categories = [] } = useCategories();

  const categoryLinks: ShopLink[] = categories
    .filter((category) => category.isActive && !category.parentId)
    .map((category) => ({
      label: category.name,
      href: `/next-power/products?category=${category.slug}`,
      blurb: category.description ?? undefined,
    }));

  return {
    user,
    isStaff,
    cartCount,
    wishlistCount,
    chatHref: isStaff ? `${adminHome()}/chats` : '/next-power/chat',
    chatUnread: isStaff ? staffChats : customerChat,
    categoryLinks,
    shopLinks: [
      { label: 'All products', href: '/next-power/products' },
      ...categoryLinks,
      { label: 'Deals', href: '/next-power/deals' },
    ] as ShopLink[],
  };
};

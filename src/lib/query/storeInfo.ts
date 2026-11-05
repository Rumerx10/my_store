import { SITE } from '@/docs/site';
import { useStore } from './shop';

// The store's name and contact details as the seller set them (GET /store), with the
// built-in copy until they load.
export const useStoreInfo = () => {
  const { data: store } = useStore();
  const phone = store?.phone ?? SITE.phone;
  return {
    name: store?.name ?? SITE.name,
    email: store?.email ?? SITE.email,
    phone,
    phoneHref: phone.replace(/[^+\d]/g, ''),
    address: store?.address ?? SITE.address,
    hours: store?.supportHours ?? SITE.hours,
    logoUrl: store?.logoUrl ?? null,
  };
};

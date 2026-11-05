'use client';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useStoreInfo } from '@/lib/query/storeInfo';

// The store's contact details, as set in the seller centre.
const ContactDetails = () => {
  const store = useStoreInfo();
  const details = [
    { icon: Phone, label: 'Phone', value: store.phone, href: `tel:${store.phoneHref}` },
    { icon: Mail, label: 'Email', value: store.email, href: `mailto:${store.email}` },
    { icon: MapPin, label: 'Address', value: store.address },
    { icon: Clock, label: 'Hours', value: store.hours },
  ];

  return (
    <dl className="space-y-5">
      {details.map(({ icon: Icon, label, value, href }) => (
        <div key={label} className="flex gap-3">
          <Icon
            className="mt-0.5 size-4 shrink-0 text-gray-400 dark:text-slate-500"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <dt className="text-sm font-medium text-gray-900 dark:text-slate-100">{label}</dt>
            <dd className="break-words text-sm text-gray-600 dark:text-slate-400">
              {href ? (
                <a
                  href={href}
                  className="rounded transition-colors hover:text-gray-900 dark:hover:text-slate-100"
                >
                  {value}
                </a>
              ) : (
                value
              )}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
};

export default ContactDetails;

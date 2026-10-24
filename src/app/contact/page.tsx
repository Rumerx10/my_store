import type { Metadata } from 'next';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from '@/components/contact/ContactForm';
import { SITE } from '@/docs/site';

export const metadata: Metadata = {
  title: 'Contact us',
  description: `Get in touch with the ${SITE.name} support team.`,
};

const DETAILS = [
  { icon: Phone, label: 'Phone', value: SITE.phone, href: `tel:${SITE.phoneHref}` },
  { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: MapPin, label: 'Address', value: SITE.address },
  { icon: Clock, label: 'Hours', value: SITE.hours },
];

const page = () => {
  return (
    <div className="container py-8 md:py-14">
      <h1 className="text-3xl text-gray-900 dark:text-slate-100 md:text-4xl">Contact us</h1>
      <p className="mt-2 max-w-xl text-gray-600 dark:text-slate-400">
        Send us a message and we reply within one working day. For an existing order, include the
        order number.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
        <div className="rounded-xl glass p-5 md:p-6">
          <ContactForm />
        </div>

        <dl className="space-y-5">
          {DETAILS.map(({ icon: Icon, label, value, href }) => (
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
      </div>
    </div>
  );
};

export default page;

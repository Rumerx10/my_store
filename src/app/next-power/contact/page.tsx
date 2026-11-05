import type { Metadata } from 'next';
import ContactDetails from '@/components/next-power/contact/ContactDetails';
import ContactForm from '@/components/next-power/contact/ContactForm';
import { SITE } from '@/docs/site';

export const metadata: Metadata = {
  title: 'Contact us',
  description: `Get in touch with the ${SITE.name} support team.`,
};

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

        <ContactDetails />
      </div>
    </div>
  );
};

export default page;

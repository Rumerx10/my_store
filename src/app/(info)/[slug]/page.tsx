import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { INFO_PAGES } from '@/docs/infoPages';

type Props = { params: Promise<{ slug: string }> };

// Only the slugs in INFO_PAGES exist; anything else is a 404.
export const dynamicParams = false;

export const generateStaticParams = () => Object.keys(INFO_PAGES).map((slug) => ({ slug }));

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const page = INFO_PAGES[(await params).slug];
  return page ? { title: page.title, description: page.intro } : {};
};

const page = async ({ params }: Props) => {
  const info = INFO_PAGES[(await params).slug];
  if (!info) notFound();

  return (
    <article className="container py-8 md:py-14">
      <div className="mx-auto max-w-3xl rounded-3xl glass p-6 md:p-12">
        <h1 className="text-3xl text-gray-900 md:text-4xl">{info.title}</h1>
        <p className="mt-3 text-lg text-gray-600">{info.intro}</p>
        {info.updated && <p className="mt-2 text-sm text-gray-500">Last updated {info.updated}</p>}

        <div className="mt-10 space-y-8 border-t border-gray-200 pt-8">
          {info.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg text-gray-900">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-2 leading-relaxed text-gray-700">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-10 border-t border-gray-200 pt-6 text-sm text-gray-600">
          Still have a question?{' '}
          <Link href="/contact" className="rounded font-medium text-brand hover:text-brand-hover">
            Contact us
          </Link>
        </p>
      </div>
    </article>
  );
};

export default page;

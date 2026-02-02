import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function BackButton({ name, href }: { name:string, href: string }) {
  return (
    <div className="hidden mb-6 md:flex items-center justify-end">
      <Link href={href}>
        <Button variant="ghost" size="sm" className=" bg-bgGray text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {name}
        </Button>
      </Link>
    </div>
  );
}
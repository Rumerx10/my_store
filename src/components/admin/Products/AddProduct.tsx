'use client';
import { useSearchParams } from 'next/navigation';
import { PageLoader } from '@/components/common/QueryState';
import { useProduct } from '@/lib/query/catalog';
import ProductForm from './ProductForm';

// `?duplicate=<id>` starts from a copy of that product. The `n` nonce gives every
// "Save and add another" / "Save and duplicate" a fresh form, even on the same URL.
const AddProduct = () => {
  const params = useSearchParams();
  const duplicateId = params.get('duplicate') ?? undefined;
  // The full product (description, specs), not the list's summary of it.
  const { data: duplicateOf, isFetching } = useProduct(duplicateId);

  if (duplicateId && isFetching && !duplicateOf?.description) return <PageLoader />;
  return <ProductForm key={params.toString()} duplicateOf={duplicateOf} />;
};

export default AddProduct;

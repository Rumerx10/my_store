'use client';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ProductForm from './ProductForm';

// `?duplicate=<id>` starts from a copy of that product. The `n` nonce gives every
// "Save and add another" / "Save and duplicate" a fresh form, even on the same URL.
const AddProduct = () => {
  const params = useSearchParams();
  const duplicateId = Number(params.get('duplicate'));
  const duplicateOf = useSelector((state: RootState) =>
    duplicateId ? state.products.find((p) => p.id === duplicateId) : undefined,
  );

  return <ProductForm key={params.toString()} duplicateOf={duplicateOf} />;
};

export default AddProduct;

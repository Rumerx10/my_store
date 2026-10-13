'use client';
import { notFound, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ProductForm from './ProductForm';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const product = useSelector((state: RootState) =>
    state.products.find((p) => p.id === Number(id)),
  );

  if (!product) notFound();

  return <ProductForm product={product} />;
};

export default EditProduct;

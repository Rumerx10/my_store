'use client';

import { Controller, useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { Trash2, Upload } from 'lucide-react';
import { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MAX_IMAGES = 4;

const ProductImageField = () => {
  const { control, setValue, watch } = useFormContext();
  const images: File[] = watch('productImgs') || [];

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (!files.length) return;
      const newFiles = [...images, ...files].slice(0, MAX_IMAGES);
      setValue('productImgs', newFiles, { shouldValidate: true });
      e.target.value = ''; // reset file input to allow re-selecting same file
    },
    [images, setValue],
  );

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setValue('productImgs', updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative flex flex-col w-full gap-2 rounded-lg">
          <Controller
            name="productImgs"
            control={control}
            defaultValue={[]}
            render={() => (
              <div className="w-full">
                {/* BEFORE UPLOAD */}
                {images.length === 0 && (
                  <label className="border-2 border-dashed border-borderGray h-72 rounded-lg p-6 flex flex-col items-center justify-center gap-5 text-center cursor-pointer">
                    <Upload className="h-10 w-10" />
                    <p className="text-xl font-medium">Drag & drop product images</p>
                    <p className="text-gray-500">
                      or click to browse files (PNG, JPG, WEBP up to 5MB each)
                    </p>
                    <div className="border border-borderGray px-5 py-4 rounded font-medium hover:bg-bgGray duration-150">
                      Select Files
                    </div>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      onChange={handleFileChange}
                      className="absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer"
                    />
                  </label>
                )}

                {/* AFTER UPLOAD */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {images.map((file, index) => {
                      const src = URL.createObjectURL(file);
                      return (
                        <div
                          key={index}
                          className="relative w-[220px] h-[184px] bg-textGray rounded-lg overflow-hidden p-2"
                        >
                          <Image
                            src={src}
                            alt={`Uploaded ${index}`}
                            fill
                            className="object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    })}

                    {/* ADD MORE IMAGES */}
                    {images.length < MAX_IMAGES && (
                      <label className="w-[220px] h-[184px] bg-bgGray border border-dashed border-borderGray rounded-md flex flex-col items-center justify-center text-xs text-textGray cursor-pointer relative">
                        <Upload className="h-6 w-6 mb-1" />
                        Add Image
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          multiple
                          onChange={handleFileChange}
                          className="absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer"
                        />
                      </label>
                    )}
                  </div>
                )}
              </div>
            )}
          />
        </div>
        <p className="text-sm text-gray-600 mt-5">
          Upload up to 10 images. First image will be the main product image.
        </p>
      </CardContent>
    </Card>
  );
};

export default ProductImageField;

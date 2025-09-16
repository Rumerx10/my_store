'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus, Tag } from 'lucide-react';

const ProductTags = () => {
  const { watch, setValue } = useFormContext();
  const tags: string[] = watch('tags') || [];
  const [currentTag, setCurrentTag] = useState('');

  const addTag = () => {
    const trimmed = currentTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setValue('tags', [...tags, trimmed]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      'tags',
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Product Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag"
            className='h-10'
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductTags;

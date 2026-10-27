"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { ImagePlus, Trash } from 'lucide-react';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return ( 
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="sm">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
              // pasted URLs can be on any host; only the hosts in next.config remotePatterns go through the optimizer
              unoptimized={!/^https:\/\/(res\.cloudinary\.com|images\.unsplash\.com)\//.test(url)}
            />
          </div>
        ))}
      </div>
      {/* The upload widget needs a Cloudinary cloud name; without one, accept a pasted image URL instead. */}
      {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? (
        <div className="flex max-w-xl items-center gap-2">
          <Input
            type="url"
            disabled={disabled}
            placeholder="Paste an image URL (https://...)"
            aria-label="Image URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            type="button"
            disabled={disabled || !/^https?:\/\/\S+$/.test(url.trim())}
            variant="secondary"
            onClick={() => { onChange(url.trim()); setUrl(''); }}
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
      ) : (
      <CldUploadWidget onSuccess={onUpload} uploadPreset="gvx66luj">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button 
              type="button" 
              disabled={disabled} 
              variant="secondary" 
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
      )}
    </div>
  );
}
 
export default ImageUpload;

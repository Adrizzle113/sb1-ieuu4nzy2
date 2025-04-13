import { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { TourFormValues } from './types';
import { ImageUploader } from '@/components/ImageUploader';

interface TourLocationProps {
  form: UseFormReturn<TourFormValues>;
}

export function TourLocation({ form }: TourLocationProps) {
  const [images, setImages] = useState<{ url: string }[]>([]);

  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setImages([...images, { url: imageUrl }]);
  };

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 pt-4">
      <FormField
        control={form.control}
        name="mapUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Google Maps URL *</FormLabel>
            <FormControl>
              <div className="flex space-x-2">
                <Input 
                  {...field} 
                  placeholder="https://maps.google.com/..." 
                  onChange={(e) => {
                    field.onChange(e);
                    form.trigger("mapUrl");
                  }}
                />
                <Button type="button" variant="outline">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </FormControl>
            <FormDescription>
              Enter a valid Google Maps embed URL (e.g., https://www.google.com/maps/embed?pb=...)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="aspect-video rounded-lg border overflow-hidden">
        {form.watch("mapUrl") && !form.getFieldState("mapUrl").error && (
          <iframe
            src={form.watch("mapUrl")}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>

      <div className="space-y-4">
        <FormLabel>Location Images</FormLabel>
        <ImageUploader
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
          images={images}
          label="Upload location and destination images"
          multiple
        />
      </div>
    </div>
  );
}
import { useState } from 'react';
import { FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { TourFormValues } from './types';
import { ImageUploader } from '@/components/ImageUploader';

interface TourTermsProps {
  form: UseFormReturn<TourFormValues>;
}

const standardTerms = [
  "Cancellation Policy: Full refund up to 48 hours before the tour starts",
  "Weather conditions may affect tour schedules",
  "Participants must be physically fit for planned activities",
  "Travel insurance is recommended",
  "Tour operator reserves the right to modify itinerary if necessary",
  "Participants must follow local customs and regulations",
  "Personal belongings are the responsibility of participants",
  "Minimum number of participants required for tour to proceed"
];

export function TourTerms({ form }: TourTermsProps) {
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
      <div className="space-y-4">
        <div className="rounded-lg border p-4 space-y-2">
          <h3 className="font-medium">Standard Terms</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {standardTerms.map((term, index) => (
              <li key={index}>{term}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <FormLabel>Additional Terms & Conditions</FormLabel>
          <Textarea
            placeholder="Enter any additional terms on a new line"
            className="min-h-[200px]"
            {...form.register('additionalTerms')}
          />
        </div>

        <div className="space-y-4">
          <FormLabel>Supporting Documents</FormLabel>
          <ImageUploader
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            images={images}
            label="Upload supporting documents and images"
            multiple
          />
        </div>
      </div>
    </div>
  );
}
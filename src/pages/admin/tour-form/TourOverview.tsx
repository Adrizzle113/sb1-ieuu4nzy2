import { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Plane, Hotel, Plus, Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { TourFormValues } from './types';
import { ImageUploader } from '@/components/ImageUploader';

interface TourOverviewProps {
  form: UseFormReturn<TourFormValues>;
}

export function TourOverview({ form }: TourOverviewProps) {
  const [images, setImages] = useState<{ url: string }[]>([]);

  // Initialize local state from form values
  useEffect(() => {
    const formValues = form.getValues();
    if (formValues.travelBrief?.flights) {
      form.setValue('travelBrief.flights', {
        arrival: formValues.travelBrief.flights.arrival || '',
        departure: formValues.travelBrief.flights.departure || '',
        notes: formValues.travelBrief.flights.notes || ''
      }, { shouldDirty: true });
    }
  }, [form]);

  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setImages([...images, { url: imageUrl }]);
  };

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Ensure travelBrief exists in form data
  const ensureTravelBrief = () => {
    const formValues = form.getValues();
    if (!formValues.travelBrief) {
      form.setValue('travelBrief', {
        description: formValues.summary || '',
        mapUrl: formValues.mapUrl || '',
        flights: {
          arrival: '',
          departure: '',
          notes: ''
        },
        accommodations: []
      }, { shouldDirty: true });
    }
  };

  const addAccommodation = () => {
    const currentAccommodations = form.getValues('travelBrief.accommodations') || [];
    form.setValue('travelBrief.accommodations', [
      ...currentAccommodations,
      {
        days: '',
        nights: 1,
        location: '',
        roomType: '',
        boardBasis: ''
      }
    ], { shouldDirty: true });
  };

  const removeAccommodation = (index: number) => {
    const currentAccommodations = form.getValues('travelBrief.accommodations') || [];
    form.setValue(
      'travelBrief.accommodations',
      currentAccommodations.filter((_, i) => i !== index),
      { shouldDirty: true }
    );
  };

  return (
    <div className="space-y-6 pt-4">
      <FormField
        control={form.control}
        name="summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Executive Summary *</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className="min-h-[100px]"
              />
            </FormControl>
            <FormDescription>
              Provide a detailed summary between 100 and 500 characters
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Travel Details</h4>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Plane className="h-4 w-4" /></TableHead>
                <TableHead>Flight Details</TableHead>
                <TableHead>Information</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Arrival</TableCell>
                <TableCell colSpan={2}>
                  <Input 
                    placeholder="e.g., Flight AA123 arriving at 14:30 on May 15, 2025" 
                    className="w-full"
                    value={form.watch('travelBrief.flights.arrival') || ''}
                    onChange={(e) => {
                      ensureTravelBrief();
                      form.setValue('travelBrief.flights.arrival', e.target.value, { 
                        shouldDirty: true,
                        shouldTouch: true
                      });
                    }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Departure</TableCell>
                <TableCell colSpan={2}>
                  <Input 
                    placeholder="e.g., Flight AA456 departing at 16:45 on May 22, 2025" 
                    className="w-full"
                    value={form.watch('travelBrief.flights.departure') || ''}
                    onChange={(e) => {
                      ensureTravelBrief();
                      form.setValue('travelBrief.flights.departure', e.target.value, { 
                        shouldDirty: true,
                        shouldTouch: true
                      });
                    }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Additional Notes</TableCell>
                <TableCell colSpan={2}>
                  <Textarea 
                    placeholder="Any additional flight information" 
                    className="min-h-[80px] w-full"
                    value={form.watch('travelBrief.flights.notes') || ''}
                    onChange={(e) => {
                      ensureTravelBrief();
                      form.setValue('travelBrief.flights.notes', e.target.value, { 
                        shouldDirty: true,
                        shouldTouch: true
                      });
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Hotel className="h-4 w-4" />
              Accommodations
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAccommodation}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Accommodation
            </Button>
          </div>

          <div className="space-y-4">
            {form.watch('travelBrief.accommodations')?.map((_, index) => (
              <div key={index} className="rounded-md border p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h5 className="text-sm font-medium">Accommodation {index + 1}</h5>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAccommodation(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`travelBrief.accommodations.${index}.location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Grand Hotel, Paris" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`travelBrief.accommodations.${index}.days`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Days 1-3" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`travelBrief.accommodations.${index}.nights`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Nights</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`travelBrief.accommodations.${index}.roomType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Type</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Deluxe Double" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`travelBrief.accommodations.${index}.boardBasis`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Board Basis</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Bed & Breakfast" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <FormLabel>Hotel Images</FormLabel>
          <ImageUploader
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            images={images}
            label="Upload hotel and accommodation images"
            multiple
          />
        </div>
      </div>
    </div>
  );
}
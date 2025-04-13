import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Plus, Minus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { TourFormValues } from './types';

interface TourInclusionsProps {
  form: UseFormReturn<TourFormValues>;
}

export function TourInclusions({ form }: TourInclusionsProps) {
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [error, setError] = useState<string | null>(null);

  const inclusions = form.watch('inclusions') || [];
  const exclusions = form.watch('exclusions') || [];

  const handleAddInclusion = () => {
    if (!newInclusion.trim()) {
      setError('Please enter an inclusion item');
      return;
    }

    const updatedInclusions = [...inclusions, newInclusion.trim()];
    form.setValue('inclusions', updatedInclusions, { shouldDirty: true });
    setNewInclusion('');
    setError(null);
  };

  const handleAddExclusion = () => {
    if (!newExclusion.trim()) {
      setError('Please enter an exclusion item');
      return;
    }

    const updatedExclusions = [...exclusions, newExclusion.trim()];
    form.setValue('exclusions', updatedExclusions, { shouldDirty: true });
    setNewExclusion('');
    setError(null);
  };

  const handleRemoveInclusion = (index: number) => {
    const updatedInclusions = inclusions.filter((_, i) => i !== index);
    form.setValue('inclusions', updatedInclusions, { shouldDirty: true });
  };

  const handleRemoveExclusion = (index: number) => {
    const updatedExclusions = exclusions.filter((_, i) => i !== index);
    form.setValue('exclusions', updatedExclusions, { shouldDirty: true });
  };

  return (
    <div className="space-y-6 pt-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Inclusions Section */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="inclusions"
          render={() => (
            <FormItem>
              <FormLabel>What's Included</FormLabel>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an inclusion..."
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInclusion()}
                  />
                  <Button
                    type="button"
                    onClick={handleAddInclusion}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {inclusions.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-accent/50 rounded-md group"
                    >
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="flex-1">{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveInclusion(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Exclusions Section */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="exclusions"
          render={() => (
            <FormItem>
              <FormLabel>What's Not Included</FormLabel>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an exclusion..."
                    value={newExclusion}
                    onChange={(e) => setNewExclusion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddExclusion()}
                  />
                  <Button
                    type="button"
                    onClick={handleAddExclusion}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {exclusions.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-accent/50 rounded-md group"
                    >
                      <X className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span className="flex-1">{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveExclusion(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
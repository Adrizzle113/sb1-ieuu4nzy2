import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { TourBasics } from './tour-form/TourBasics';
import { TourOverview } from './tour-form/TourOverview';
import { TourLocation } from './tour-form/TourLocation';
import { TourItinerary } from './tour-form/TourItinerary';
import { TourPricing } from './tour-form/TourPricing';
import { TourTerms } from './tour-form/TourTerms';
import { TourInclusions } from './tour-form/TourInclusions';
import { TourFormValues, tourFormSchema } from './tour-form/types';
import { formatDBDate, parseDBDate } from '@/lib/utils';

export default function TourForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('Ready');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      title: '',
      summary: '',
      mapUrl: '',
      basePrice: 0,
      deposit: 0,
      depositType: 'percentage',
      maxParticipants: 1,
      termsAccepted: false,
      itinerary: [],
      inclusions: [],
      exclusions: [],
      travelBrief: {
        description: '',
        mapUrl: '',
        flights: {
          arrival: '',
          departure: '',
          notes: ''
        },
        accommodations: []
      }
    },
  });

  const fetchTourData = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const { data: tour, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!tour) {
        toast({
          variant: "destructive",
          title: "Tour not found",
          description: "The requested tour could not be found.",
        });
        navigate('/admin/tours');
        return;
      }

      // Process travel brief correctly
      const travelBrief = tour.travel_brief || {
        description: tour.description || '',
        mapUrl: tour.location || '',
        flights: {
          arrival: '',
          departure: '',
          notes: ''
        },
        accommodations: []
      };

      const formData = {
        title: tour.title,
        summary: tour.description || '',
        mapUrl: tour.location,
        basePrice: Number(tour.price),
        maxParticipants: Number(tour.max_participants),
        startDate: parseDBDate(tour.start_date),
        endDate: parseDBDate(tour.end_date),
        deposit: 0,
        depositType: 'percentage' as const,
        termsAccepted: true,
        itinerary: tour.itinerary || [],
        inclusions: tour.inclusions || [],
        exclusions: tour.exclusions || [],
        travelBrief: travelBrief,
        locations: tour.locations || []
      };

      form.reset(formData);
      setLastSaved(new Date(tour.updated_at));
      setAutoSaveStatus('Up to date');
    } catch (error) {
      console.error('Error fetching tour:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tour data",
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast, navigate, form]);

  useEffect(() => {
    fetchTourData();
  }, [fetchTourData]);

  const onSubmit = async (data: TourFormValues) => {
    try {
      setIsLoading(true);
      setAutoSaveStatus('Saving...');

      const tourData = {
        title: data.title,
        description: data.summary,
        price: data.basePrice,
        duration_days: data.itinerary.length,
        location: data.mapUrl,
        max_participants: data.maxParticipants,
        start_date: formatDBDate(data.startDate),
        end_date: formatDBDate(data.endDate),
        itinerary: data.itinerary,
        inclusions: data.inclusions,
        exclusions: data.exclusions,
        travel_brief: data.travelBrief,
        locations: data.locations || []
      };

      if (id) {
        const { error } = await supabase
          .from('tours')
          .update(tourData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Tour updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('tours')
          .insert([tourData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Tour created successfully",
        });
        navigate('/admin/tours');
      }

      setLastSaved(new Date());
      setAutoSaveStatus('Saved');
    } catch (error) {
      console.error('Error saving tour:', error);
      setAutoSaveStatus('Save failed');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save tour",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    return `Last saved: ${lastSaved.toLocaleTimeString()}`;
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit Tour' : 'Create New Tour'}</CardTitle>
          <CardDescription>
            Complete all required fields (*) to create or update a tour package.
            Form auto-saves every 30 seconds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Accordion type="single" collapsible defaultValue="basics">
                <AccordionItem value="basics">
                  <AccordionTrigger>Tour Basics</AccordionTrigger>
                  <AccordionContent>
                    <TourBasics form={form} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="overview">
                  <AccordionTrigger>Tour Overview</AccordionTrigger>
                  <AccordionContent>
                    <TourOverview form={form} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="location">
                  <AccordionTrigger>Location Mapping</AccordionTrigger>
                  <AccordionContent>
                    <TourLocation form={form} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="itinerary">
                  <AccordionTrigger>Daily Itinerary</AccordionTrigger>
                  <AccordionContent>
                    <TourItinerary form={form} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="inclusions">
                  <AccordionTrigger>Inclusions & Exclusions</AccordionTrigger>
                  <AccordionContent>
                    <TourInclusions form={form} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="pricing">
                  <AccordionTrigger>Pricing Structure</AccordionTrigger>
                  <AccordionContent>
                    <TourPricing form={form} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="terms">
                  <AccordionTrigger>Terms & Conditions</AccordionTrigger>
                  <AccordionContent>
                    <TourTerms form={form} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {autoSaveStatus} {formatLastSaved()}
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" type="button">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Tour
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
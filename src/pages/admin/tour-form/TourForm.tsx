import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
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
import { Loader2, Save, Eye, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { RootState } from '@/store';
import { formatDBDate } from '@/lib/utils';
import {
  TourBasics,
  TourOverview,
  TourLocation,
  TourItinerary,
  TourPricing,
  TourTerms,
  TourInclusions,
  TourFormValues,
  tourFormSchema
} from './tour-form';

export default function TourForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('Ready');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.user_metadata?.role === 'admin';

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

      // Ensure each activity has an icon
      const itinerary = tour.itinerary?.map((day: any) => ({
        ...day,
        activities: day.activities?.map((activity: any) => ({
          ...activity,
          icon: activity.icon || 'Other'
        })) || []
      })) || [];

      const formData = {
        title: tour.title,
        summary: tour.description || '',
        mapUrl: tour.location,
        basePrice: Number(tour.price),
        maxParticipants: Number(tour.max_participants),
        startDate: new Date(tour.start_date),
        endDate: new Date(tour.end_date),
        deposit: 0,
        depositType: 'percentage' as const,
        termsAccepted: true,
        itinerary,
        inclusions: tour.inclusions || [],
        exclusions: tour.exclusions || [],
        travelBrief: travelBrief
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
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Unauthorized",
        description: "You do not have permission to manage tours.",
      });
      navigate('/dashboard');
      return;
    }

    fetchTourData();
  }, [isAdmin, fetchTourData, toast, navigate]);

  const onSubmit = async (data: TourFormValues) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Unauthorized",
        description: "You do not have permission to save tours.",
      });
      return;
    }

    try {
      setIsLoading(true);
      setAutoSaveStatus('Saving...');

      // Ensure each activity has an icon
      const itinerary = data.itinerary.map(day => ({
        ...day,
        activities: day.activities.map(activity => ({
          ...activity,
          icon: activity.icon || 'Other'
        }))
      }));

      const tourData = {
        title: data.title,
        description: data.summary,
        price: data.basePrice,
        duration_days: data.itinerary.length,
        location: data.mapUrl,
        max_participants: data.maxParticipants,
        start_date: formatDBDate(data.startDate),
        end_date: formatDBDate(data.endDate),
        itinerary,
        inclusions: data.inclusions,
        exclusions: data.exclusions,
        travel_brief: data.travelBrief
      };

      let result;
      if (id) {
        const { data: updatedTour, error } = await supabase
          .from('tours')
          .update(tourData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        result = updatedTour;

        toast({
          title: "Success",
          description: "Tour updated successfully",
        });
      } else {
        const { data: newTour, error } = await supabase
          .from('tours')
          .insert([tourData])
          .select()
          .single();

        if (error) throw error;
        result = newTour;

        toast({
          title: "Success",
          description: "Tour created successfully",
        });
      }

      setLastSaved(new Date());
      setAutoSaveStatus('Saved');

      // Navigate with refresh parameter
      const destination = id 
        ? `/admin/tours/${id}?refresh=true`
        : `/admin/tours/${result.id}?refresh=true`;
      navigate(destination, { replace: true });
    } catch (error) {
      console.error('Save error:', error);
      setAutoSaveStatus('Save failed');
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save tour",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    if (id) {
      navigate(`/tours/${id}/itinerary`);
    } else {
      toast({
        title: "Info",
        description: "Please save the tour first to preview it",
      });
    }
  };

  const handleBackToList = () => {
    navigate('/admin/tours?refresh=true');
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Not saved yet';
    const diffInSeconds = Math.floor((new Date().getTime() - lastSaved.getTime()) / 1000);
    if (diffInSeconds < 60) return `Saved ${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `Saved ${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    return `Saved at ${lastSaved.toLocaleTimeString()}`;
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{id ? 'Edit Tour' : 'Create New Tour'}</CardTitle>
            <CardDescription>
              Complete all required fields (*) to create or update a tour package.
            </CardDescription>
          </div>
          {id && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchTourData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
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
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${
                    autoSaveStatus === 'Unsaved changes' 
                      ? 'bg-yellow-500' 
                      : autoSaveStatus === 'Saving...' 
                        ? 'bg-blue-500' 
                        : autoSaveStatus === 'Saved' || autoSaveStatus === 'Up to date'
                          ? 'bg-green-500'
                          : autoSaveStatus === 'Save failed'
                            ? 'bg-red-500'
                            : 'bg-gray-500'
                  }`}></span>
                  <span>{autoSaveStatus}</span>
                  {lastSaved && <span className="text-xs opacity-70">({formatLastSaved()})</span>}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" type="button" onClick={handleBackToList}>
                    Back to List
                  </Button>
                  <Button variant="outline" type="button" onClick={handlePreview}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !isAdmin}
                  >
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
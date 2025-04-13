import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { validate as uuidValidate } from 'uuid';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { TourFormValues } from '@/pages/admin/tour-form/types';
import { TourBasics } from '@/pages/admin/tour-form/TourBasics';
import { TourOverview } from '@/pages/admin/tour-form/TourOverview';
import { TourLocation } from '@/pages/admin/tour-form/TourLocation';
import { TourItinerary } from '@/pages/admin/tour-form/TourItinerary';
import { TourPricing } from '@/pages/admin/tour-form/TourPricing';
import { TourTerms } from '@/pages/admin/tour-form/TourTerms';
import { useForm } from 'react-hook-form';

const isValidUUID = (uuid: string | undefined): boolean => {
  if (!uuid) return false;
  try {
    return uuidValidate(uuid);
  } catch {
    return false;
  }
};

export default function LuxuryTravelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize form with empty values
  const form = useForm<TourFormValues>({
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
    },
  });

  useEffect(() => {
    if (!isValidUUID(id)) {
      toast({
        variant: "destructive",
        title: "Invalid Tour ID",
        description: "The tour ID format is invalid. Redirecting to tours page.",
      });
      navigate('/tours');
      return;
    }

    const fetchTourData = async () => {
      try {
        const { data: tour, error } = await supabase
          .from('tours')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (!tour) {
          toast({
            variant: "destructive",
            title: "Tour Not Found",
            description: "The requested tour could not be found.",
          });
          navigate('/tours');
          return;
        }

        // Transform tour data to match form values
        const formData: TourFormValues = {
          title: tour.title,
          summary: tour.description || '',
          mapUrl: tour.location,
          basePrice: tour.price,
          maxParticipants: tour.max_participants,
          startDate: new Date(tour.start_date),
          endDate: new Date(tour.end_date),
          deposit: 0,
          depositType: 'percentage',
          termsAccepted: true,
          itinerary: tour.itinerary || [],
        };

        // Update form with fetched data
        form.reset(formData);
      } catch (error) {
        console.error('Error fetching trip data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load tour details",
        });
        navigate('/tours');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourData();
  }, [id, toast, navigate, form]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="space-y-8">
        <section id="basics" className="bg-white rounded-lg shadow-sm p-6">
          <TourBasics form={form} />
        </section>

        <section id="overview" className="bg-white rounded-lg shadow-sm p-6">
          <TourOverview form={form} />
        </section>

        <section id="location" className="bg-white rounded-lg shadow-sm p-6">
          <TourLocation form={form} />
        </section>

        <section id="itinerary" className="bg-white rounded-lg shadow-sm p-6">
          <TourItinerary form={form} />
        </section>

        <section id="pricing" className="bg-white rounded-lg shadow-sm p-6">
          <TourPricing form={form} />
        </section>

        <section id="terms" className="bg-white rounded-lg shadow-sm p-6">
          <TourTerms form={form} />
        </section>
      </div>
    </div>
  );
}
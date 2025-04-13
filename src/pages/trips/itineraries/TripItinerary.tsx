import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { validate as uuidValidate } from 'uuid';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import ItineraryNavigation from '@/components/navigation/itinerary/ItineraryNavigation';
import ImagePanel from './itinerarytemplate/imagepanel/ImagePanel';
import WelcomeSection from './itinerarytemplate/welcomepage/WelcomeSection';
import TravelBrief from './itinerarytemplate/travelbrief/TravelBrief';
import Map from './itinerarytemplate/map/Map';
import WhatsIncluded from './itinerarytemplate/include/WhatsIncluded';
import Itinerary from './itinerarytemplate/days/Itinerary';
import Terms from './itinerarytemplate/terms/Terms';
import { CTA } from './itinerarytemplate/cta/CTA';
import { formatDisplayDate, parseDBDate } from '@/lib/utils';
import type { TourFormValues } from '@/pages/admin/tour-form/types';
import styles from './TripItinerary.module.css';

const isValidUUID = (uuid: string | undefined): boolean => {
  if (!uuid) return false;
  try {
    return uuidValidate(uuid);
  } catch {
    return false;
  }
};

export default function TripItinerary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tourData, setTourData] = useState<TourFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const { toast } = useToast();

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

        // Transform dates to proper format
        const startDate = parseDBDate(tour.start_date);
        const endDate = parseDBDate(tour.end_date);

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

        // Get locations from accommodations
        const accommodationLocations = travelBrief.accommodations?.map(acc => acc.location) || [];

        // Transform tour data to match TourFormValues structure
        const transformedData: TourFormValues = {
          title: tour.title,
          summary: tour.description || '',
          startDate,
          endDate,
          mapUrl: tour.location,
          basePrice: tour.price,
          deposit: tour.price * 0.25,
          depositType: 'percentage',
          maxParticipants: tour.max_participants,
          termsAccepted: true,
          itinerary: tour.itinerary || [],
          highlights: [],
          inclusions: tour.inclusions || [],
          exclusions: tour.exclusions || [],
          pricing: {
            basePrice: tour.price,
            deposit: tour.price * 0.25,
            depositType: 'percentage'
          },
          images: tour.image_url ? [{ 
            url: tour.image_url, 
            section: 'overview' 
          }] : [],
          travelBrief: travelBrief
        };

        setTourData(transformedData);
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
  }, [id, toast, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = 'overview';

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          current = section.id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!tourData) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2 className={styles.errorTitle}>Tour Not Found</h2>
          <p className={styles.errorMessage}>The tour you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  // Get locations from accommodations
  const accommodationLocations = tourData.travelBrief?.accommodations?.map(acc => acc.location) || [];

  const tripSummary = {
    id: id!,
    title: tourData.title,
    status: 'active',
    duration: tourData.itinerary.length ? `${tourData.itinerary.length} Days` : '',
    destinations: accommodationLocations,
    startDate: formatDisplayDate(tourData.startDate),
    endDate: formatDisplayDate(tourData.endDate),
    highlights: tourData.highlights || [],
    images: tourData.images || [],
    pricing: tourData.pricing,
    travelBrief: tourData.travelBrief
  };

  return (
    <div className={styles.container}>
      <div className={styles.imagePanel}>
        <ImagePanel 
          images={tourData.images || []}
          activeSection={activeSection}
        />
      </div>

      <div className={styles.contentPanel}>
        <ItineraryNavigation tripData={tripSummary} />
        
        <div className={styles.sections}>
          <section id="overview" className={styles.section}>
            <WelcomeSection 
              title={tourData.title}
              startDate={formatDisplayDate(tourData.startDate)}
              endDate={formatDisplayDate(tourData.endDate)}
            />
          </section>

          <section id="travel-brief" className={styles.section}>
            <TravelBrief travelBrief={tourData.travelBrief} />
          </section>
          
          <section id="locations" className={styles.section}>
            <Map 
              locations={[{ location: tourData.mapUrl }]}
              mapUrl={tourData.mapUrl}
              travelBrief={tourData.travelBrief}
            />
          </section>
          
          <section id="inclusions" className={styles.section}>
            <WhatsIncluded 
              inclusions={tourData.inclusions}
              exclusions={tourData.exclusions}
            />
          </section>
          
          <section id="itinerary" className={styles.section}>
            <Itinerary items={tourData.itinerary} />
          </section>
          
          <section id="cta" className={styles.section}>
            <CTA tripData={tripSummary} />
          </section>
                  
          <section id="terms" className={styles.section}>
            <Terms customTerms={tourData.terms} />
          </section>
        </div>
      </div>
    </div>
  );
}
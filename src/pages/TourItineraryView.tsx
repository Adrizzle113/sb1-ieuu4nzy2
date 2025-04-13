import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/lib/database.types';
import { format } from 'date-fns';

type Tour = Database['public']['Tables']['tours']['Row'] & {
  itinerary?: Array<{
    location: string;
    activities: Array<{
      time: string;
      description: string;
      duration: string;
    }>;
    notes: string;
    details: {
      title: string;
      description: string;
      media: any[];
      videos: Array<{
        id: string;
        url: string;
        type: 'youtube' | 'vimeo';
      }>;
      isExpanded: boolean;
      isUploading: boolean;
      videoUrl?: string;
      videoError?: string;
    };
  }>;
};

export default function TourItineraryView() {
  const { id } = useParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchTour() {
      try {
        if (!id) return;

        const { data, error } = await supabase
          .from('tours')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        console.log('Fetched tour data:', data); // Debug log
        setTour(data);
      } catch (error) {
        console.error('Error fetching tour:', error); // Debug log
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load tour details",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchTour();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tour Not Found</h2>
          <p className="text-gray-600">The tour you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Tour Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{tour.title}</h1>
          <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{tour.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{format(new Date(tour.start_date), 'MMM dd, yyyy')} - {format(new Date(tour.end_date), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span>Max {tour.max_participants} participants</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              <span>${tour.price}</span>
            </div>
          </div>
          {tour.image_url && (
            <img
              src={tour.image_url}
              alt={tour.title}
              className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
            />
          )}
          <p className="text-gray-700">{tour.description}</p>
        </div>

        {/* Itinerary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Tour Itinerary</h2>
          {tour.itinerary && tour.itinerary.length > 0 ? (
            <div className="space-y-8">
              {tour.itinerary.map((day, index) => (
                <div key={index} className="border-b pb-8 last:border-b-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{day.details.title || `Day ${index + 1}`}</h3>
                      <p className="text-gray-600">{day.location}</p>
                    </div>
                  </div>

                  {day.details.description && (
                    <p className="text-gray-700 mb-4">{day.details.description}</p>
                  )}

                  {day.activities && day.activities.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Daily Activities</h4>
                      <div className="space-y-3">
                        {day.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
                            <div className="min-w-[100px] text-sm font-medium text-gray-600">
                              {activity.time}
                              {activity.duration && (
                                <div className="text-xs text-gray-500">{activity.duration}</div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-800">{activity.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {day.notes && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Additional Notes</h4>
                      <p className="text-gray-700">{day.notes}</p>
                    </div>
                  )}

                  {/* Media Gallery */}
                  {day.details.media && day.details.media.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Gallery</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {day.details.media.map((media, mediaIndex) => (
                          <div key={mediaIndex} className="aspect-square rounded-lg overflow-hidden">
                            {media.type?.startsWith('image/') ? (
                              <img
                                src={URL.createObjectURL(media)}
                                alt={`Day ${index + 1} gallery ${mediaIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={URL.createObjectURL(media)}
                                controls
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No itinerary details available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
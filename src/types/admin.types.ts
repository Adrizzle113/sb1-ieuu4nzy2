export interface AdminTrip {
  id: string;
  title: string;
  subtitle?: string;
  status: 'draft' | 'active' | 'archived';
  startDate?: string;
  endDate?: string;
  itinerary: Array<{
    id?: string;
    title: string;
    description?: string;
    timeline?: Array<{
      id?: string;
      type: string;
      content: any;
    }>;
  }>;
  mapLocations?: Array<{
    location: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }>;
  pricing: {
    basePrice: number;
    deposit?: number;
    depositType?: 'fixed' | 'percentage';
  };
  images: Array<{
    url: string;
    section?: string;
    alt?: string;
  }>;
  included: string[];
  excluded: string[];
  highlights?: string[];
  terms?: string[];
  travelBrief?: {
    description?: string;
    mapUrl?: string;
    flights?: {
      arrival?: string;
      departure?: string;
      notes?: string;
    };
    accommodations?: Array<{
      days: string;
      nights: number;
      location: string;
      roomType: string;
      boardBasis: string;
    }>;
  };
}
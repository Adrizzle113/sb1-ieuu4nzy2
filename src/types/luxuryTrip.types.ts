export interface TravelBrief {
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
}

export interface MapLocation {
  id: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface TripImage {
  id: string;
  url: string;
  section?: string;
  alt?: string;
}

export interface TripSummary {
  id: string;
  title: string;
  status: 'active' | 'draft' | 'archived';
  duration?: string;
  destinations?: string[];
  startDate?: string;
  endDate?: string;
  highlights?: string[];
  images?: TripImage[];
  pricing?: {
    basePrice: number;
    deposit?: number;
    depositType?: 'fixed' | 'percentage';
  };
  travelBrief?: TravelBrief;
}
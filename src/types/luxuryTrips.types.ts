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
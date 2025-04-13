import { z } from 'zod';

export interface Activity {
  time: string;
  description: string;
  duration: string;
}

export interface VideoEmbed {
  id: string;
  url: string;
  type: 'youtube' | 'vimeo';
}

export interface DayDetails {
  title: string;
  description: string;
  media: File[];
  videos: VideoEmbed[];
  isExpanded: boolean;
  isUploading: boolean;
  videoUrl?: string;
  videoError?: string;
}

export interface DayItinerary {
  location: string;
  activities: Activity[];
  notes: string;
  details: DayDetails;
}

// Define accommodation type
export interface Accommodation {
  days: string;
  nights: number;
  location: string;
  roomType: string;
  boardBasis: string;
}

// Define flights type
export interface Flights {
  arrival?: string;
  departure?: string;
  notes?: string;
}

// Define travel brief type
export interface TravelBrief {
  description?: string;
  mapUrl?: string;
  flights?: Flights;
  accommodations?: Accommodation[];
}

// Define location type
export interface Location {
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export const tourFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must not exceed 100 characters"),
  startDate: z.date({
    required_error: "Start date is required",
    invalid_type_error: "Start date must be a valid date",
  }),
  endDate: z.date({
    required_error: "End date is required",
    invalid_type_error: "End date must be a valid date",
  }),
  summary: z.string().min(10, "Summary must be at least 10 characters").max(500, "Summary must not exceed 500 characters"),
  mapUrl: z.string().url("Must be a valid URL"),
  basePrice: z.number().min(0, "Price must be non-negative"),
  deposit: z.number().min(0, "Deposit must be non-negative"),
  depositType: z.enum(['percentage', 'fixed']),
  maxParticipants: z.number().int().min(1, "Must have at least 1 participant"),
  termsAccepted: z.boolean(),
  itinerary: z.array(z.object({
    location: z.string(),
    activities: z.array(z.object({
      time: z.string(),
      description: z.string(),
      duration: z.string()
    })),
    notes: z.string(),
    details: z.object({
      title: z.string(),
      description: z.string(),
      media: z.array(z.any()),
      videos: z.array(z.object({
        id: z.string(),
        url: z.string(),
        type: z.enum(['youtube', 'vimeo'])
      })),
      isExpanded: z.boolean(),
      isUploading: z.boolean(),
      videoUrl: z.string().optional(),
      videoError: z.string().optional()
    })
  })),
  inclusions: z.array(z.string()).min(1, "At least one inclusion is required"),
  exclusions: z.array(z.string()).default([]),
  travelBrief: z.object({
    description: z.string().optional(),
    mapUrl: z.string().optional(),
    flights: z.object({
      arrival: z.string().optional(),
      departure: z.string().optional(),
      notes: z.string().optional()
    }).optional(),
    accommodations: z.array(z.object({
      days: z.string(),
      nights: z.number(),
      location: z.string(),
      roomType: z.string(),
      boardBasis: z.string()
    })).optional()
  }).optional(),
  locations: z.array(z.object({
    location: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }).optional()
  })).optional()
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type TourFormValues = z.infer<typeof tourFormSchema>;
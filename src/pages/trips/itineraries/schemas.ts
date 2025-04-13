import { z } from 'zod';

export const tripSchema = z.object({
  // Basic Info
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  isCustomTrip: z.boolean().default(false),
  preparedFor: z.string().nullable().optional(),
  startDate: z.date().nullable().optional(),
  endDate: z.date().nullable().optional(),
  
  // Travel Brief
  travelBrief: z.object({
    description: z.string().min(1, 'Description is required'),
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
  }),
  
  // Locations
  mapLocations: z.array(z.object({
    id: z.string().optional(),
    location: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }).optional()
  })).default([]),
  
  // Inclusions & Exclusions
  included: z.array(z.string()).default([]),
  excluded: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  
  // Images
  images: z.array(z.object({
    id: z.string().optional(),
    url: z.string(),
    section: z.string().optional(),
    alt: z.string().optional()
  })).default([]),
  
  // Pricing
  pricing: z.object({
    basePrice: z.number().min(0, 'Base price must be non-negative'),
    deposit: z.number().optional(),
    depositType: z.enum(['fixed', 'percentage']).optional()
  }),
  
  // Terms
  terms: z.object({
    useStandard: z.boolean().default(true),
    customTerms: z.array(z.string()).optional()
  }).default({ useStandard: true, customTerms: [] }),
  
  // Itinerary
  itinerary: z.array(z.object({
    id: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    timeline: z.array(z.object({
      id: z.string().optional(),
      type: z.string(),
      content: z.any()
    })).optional()
  })).default([])
}).refine((data) => {
  if (data.isCustomTrip && !data.preparedFor) {
    return false;
  }
  return true;
}, {
  message: "Client name is required for custom trips",
  path: ["preparedFor"]
});

export type TripFormData = z.infer<typeof tripSchema>;

export const formSteps = [
  {
    id: 'overview',
    title: 'Trip Overview',
    description: 'Basic trip information',
    requiredFields: ['title']
  },
  {
    id: 'brief',
    title: 'Travel Brief',
    description: 'Detailed trip description and logistics',
    requiredFields: ['travelBrief.description']
  },
  {
    id: 'itinerary',
    title: 'Day-by-Day Itinerary',
    description: 'Daily schedule and activities',
    requiredFields: []
  },
  {
    id: 'inclusions',
    title: 'Inclusions & Exclusions',
    description: 'What is and isn\'t included',
    requiredFields: []
  },
  {
    id: 'pricing',
    title: 'Pricing Structure',
    description: 'Cost and payment information',
    requiredFields: ['pricing.basePrice']
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    description: 'Booking conditions and policies',
    requiredFields: []
  }
];

export const standardTerms = [
  "25% non-refundable deposit required to confirm booking",
  "Full payment required 90 days before departure",
  "Comprehensive travel insurance required",
  "Cancellation fees apply as per schedule",
  "All prices are subject to change until confirmed"
];
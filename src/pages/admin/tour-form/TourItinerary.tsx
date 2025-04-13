import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin, 
  Plus, 
  Minus, 
  ChevronUp, 
  ChevronDown,
  Mountain,
  Hotel,
  Ship,
  Train,
  Bus,
  BellRing,
  PlaneLanding,
  PlaneTakeoff,
  Plane,
  Car,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TourFormValues } from './types';

interface TourItineraryProps {
  form: UseFormReturn<TourFormValues>;
}

const ACTIVITY_ICONS = {
  'Activity': { icon: Mountain, label: 'Activity' },
  'Destination': { icon: MapPin, label: 'Destination' },
  'Hotel': { icon: Hotel, label: 'Hotel' },
  'Boat': { icon: Ship, label: 'Boat' },
  'Train': { icon: Train, label: 'Train' },
  'Group Transportation': { icon: Bus, label: 'Group Transportation' },
  'Check-In': { icon: BellRing, label: 'Check-In' },
  'Arrival': { icon: PlaneLanding, label: 'Arrival' },
  'Departure': { icon: PlaneTakeoff, label: 'Departure' },
  'Internal Flight': { icon: Plane, label: 'Internal Flight' },
  'Transfer': { icon: Car, label: 'Transfer' },
  'Other': { icon: Clock, label: 'Other' }
} as const;

export function TourItinerary({ form }: TourItineraryProps) {
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});

  const itinerary = form.watch('itinerary') || [];

  const toggleDayExpansion = (dayIndex: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayIndex]: !prev[dayIndex]
    }));
  };

  const addDay = () => {
    const newDay = {
      location: '',
      activities: [],
      notes: '',
      details: {
        title: '',
        description: '',
        media: [],
        videos: [],
        isExpanded: true,
        isUploading: false,
      },
    };
    form.setValue('itinerary', [...itinerary, newDay]);
  };

  const removeDay = (dayIndex: number) => {
    const newItinerary = [...itinerary];
    newItinerary.splice(dayIndex, 1);
    form.setValue('itinerary', newItinerary);
  };

  const addActivity = (dayIndex: number) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities.push({
      icon: 'Other',
      description: '',
      duration: '',
    });
    form.setValue('itinerary', newItinerary);
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities.splice(activityIndex, 1);
    form.setValue('itinerary', newItinerary);
  };

  const handleActivityIconChange = (dayIndex: number, activityIndex: number, value: string) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities[activityIndex].icon = value;
    form.setValue('itinerary', newItinerary);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Daily Itinerary</h2>
        <Button onClick={addDay} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Day
        </Button>
      </div>

      <div className="space-y-4">
        {itinerary.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className="border rounded-lg bg-card"
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                    <span className="font-semibold">{dayIndex + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold">Day {dayIndex + 1}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleDayExpansion(dayIndex)}
                  >
                    {expandedDays[dayIndex] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDay(dayIndex)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {expandedDays[dayIndex] && (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Location"
                    value={day.location}
                    onChange={(e) => {
                      const newItinerary = [...itinerary];
                      newItinerary[dayIndex].location = e.target.value;
                      form.setValue('itinerary', newItinerary);
                    }}
                  />
                </div>

                <div>
                  <FormLabel>Day Title</FormLabel>
                  <Input
                    value={day.details.title}
                    onChange={(e) => {
                      const newItinerary = [...itinerary];
                      newItinerary[dayIndex].details.title = e.target.value;
                      form.setValue('itinerary', newItinerary);
                    }}
                    placeholder="Enter a title for this day"
                    className="mt-1"
                  />
                </div>

                <div>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={day.details.description}
                    onChange={(e) => {
                      const newItinerary = [...itinerary];
                      newItinerary[dayIndex].details.description = e.target.value;
                      form.setValue('itinerary', newItinerary);
                    }}
                    placeholder="Describe the day's activities"
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel>Activities</FormLabel>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addActivity(dayIndex)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Activity
                    </Button>
                  </div>

                  {day.activities.map((activity, activityIndex) => (
                    <div
                      key={activityIndex}
                      className="flex items-start gap-2 p-2 bg-accent/50 rounded-md"
                    >
                      <Select
                        value={activity.icon || 'Other'}
                        onValueChange={(value) => handleActivityIconChange(dayIndex, activityIndex, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(ACTIVITY_ICONS).map(([key, { icon: Icon, label }]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span>{label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="Activity description"
                        value={activity.description}
                        onChange={(e) => {
                          const newItinerary = [...itinerary];
                          newItinerary[dayIndex].activities[activityIndex].description = e.target.value;
                          form.setValue('itinerary', newItinerary);
                        }}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Duration"
                        className="w-24"
                        value={activity.duration}
                        onChange={(e) => {
                          const newItinerary = [...itinerary];
                          newItinerary[dayIndex].activities[activityIndex].duration = e.target.value;
                          form.setValue('itinerary', newItinerary);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeActivity(dayIndex, activityIndex)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div>
                  <FormLabel>Additional Notes</FormLabel>
                  <Textarea
                    value={day.notes}
                    onChange={(e) => {
                      const newItinerary = [...itinerary];
                      newItinerary[dayIndex].notes = e.target.value;
                      form.setValue('itinerary', newItinerary);
                    }}
                    placeholder="Any additional notes for this day"
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
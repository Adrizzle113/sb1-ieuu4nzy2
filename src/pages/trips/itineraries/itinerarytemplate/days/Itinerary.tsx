import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
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
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { 
  TimelineItem, 
  ItineraryItem, 
  MoreDetails, 
  ActivityContent,
  ActivityType 
} from '@/types/luxuryTrip.types';
import { Button } from "@/components/ui/button";
import styles from './Itinerary.module.css';

interface ItineraryProps {
  items?: any[];
  onUpdate?: (newItems: ItineraryItem[]) => void;
}

const ACTIVITY_ICONS = {
  'Activity': Mountain,
  'Destination': MapPin,
  'Hotel': Hotel,
  'Boat': Ship,
  'Train': Train,
  'Group Transportation': Bus,
  'Check-In': BellRing,
  'Arrival': PlaneLanding,
  'Departure': PlaneTakeoff,
  'Internal Flight': Plane,
  'Transfer': Car,
  'Other': Clock
} as const;

const PublicMediaGallery: React.FC<{ images?: string[] }> = ({ 
  images = []
}) => {
  return (
    <>
      {images && images.length > 0 && (
        <div className={styles.imageGrid}>
          {images.map((image, index) => (
            <img
              key={`gallery-image-${index}`}
              src={image}
              alt={`Gallery image ${index + 1}`}
              className={styles.detailsImage}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default function Itinerary({ items = [] }: ItineraryProps) {
  const [activeDay, setActiveDay] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const dayIndex = Number(entry.target.getAttribute('data-day-index'));
          if (!isNaN(dayIndex)) {
            setActiveDay(dayIndex);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    document.querySelectorAll('[data-day-index]').forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items.length]);

  const getDayTitle = (index: number): string => {
    const dayNumber = index + 1;
    
    if (items.length === 1) return 'Day One';

    const numberToText = [
      'One', 'Two', 'Three', 'Four', 'Five', 
      'Six', 'Seven', 'Eight', 'Nine'
    ];

    if (dayNumber <= 9) return `Day ${numberToText[dayNumber - 1]}`;

    const suffixes = ['th', 'st', 'nd', 'rd'];
    const suffix = dayNumber % 10 <= 3 && dayNumber % 100 !== 11 && dayNumber % 100 !== 12 && dayNumber % 100 !== 13
      ? suffixes[dayNumber % 10]
      : suffixes[0];

    return `Day ${dayNumber}${suffix}`;
  };

  const getActivityIcon = (iconType: string) => {
    const IconComponent = ACTIVITY_ICONS[iconType as keyof typeof ACTIVITY_ICONS] || ACTIVITY_ICONS.Other;
    return <IconComponent className={styles.activityIcon} />;
  };

  const toggleSection = (dayIndex: number, itemIndex: number) => {
    const key = `${dayIndex}-${itemIndex}`;
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (items.length === 0) {
    return (
      <section className={styles.container}>
        <div className={styles.stickyHeader}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>Daily Itinerary</h2>
          </div>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.emptyState}>
            <MapPin className={styles.emptyIcon} />
            <p>No itinerary details available yet</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.stickyHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>{getDayTitle(activeDay)}</h2>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.daysList}>
          {items.map((day, index) => (
            <div 
              key={day.id || `day-${index}`}
              className={styles.daySection}
              data-day-index={index}
            >
              <div className={styles.dayHeader}>
                <div className={styles.dayNumberWrapper}>
                  <div className={styles.iconCircle}>
                    <MapPin className={styles.icon} />
                  </div>
                  <div className={styles.dayNumber}>
                    {getDayTitle(index)}
                  </div>
                </div>
              </div>

              <div className={styles.dayContent}>
                <h3 className={styles.dayTitle}>{day.details?.title || `Day ${index + 1}`}</h3>
                
                {day.details?.description && (
                  <p className={styles.description}>{day.details.description}</p>
                )}
                
                {day.activities && day.activities.length > 0 && (
                  <div className={styles.activitiesWrapper}>
                    <h4 className={styles.activitiesTitle}>Today's Schedule</h4>
                    <ul className={styles.activities}>
                      {day.activities.map((activity, actIndex) => (
                        <li key={actIndex} className={styles.activityItem}>
                          <div className={styles.activityIconWrapper}>
                            {getActivityIcon(activity.icon || 'Other')}
                          </div>
                          <div className={styles.activityContent}>
                            <span className={styles.activityText}>{activity.description}</span>
                            {activity.duration && (
                              <span className={styles.activityDuration}>{activity.duration}</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {day.notes && (
                  <div className={styles.notesSection}>
                    <h4 className={styles.notesTitle}>Additional Notes</h4>
                    <p className={styles.notesText}>{day.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
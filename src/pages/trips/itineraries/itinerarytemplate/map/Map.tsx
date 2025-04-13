import React, { useState, useEffect } from 'react';
import type { MapLocation } from '@/types/luxuryTrip.types';
import styles from './Map.module.css';

interface MapProps {
  locations?: MapLocation[];
  mapUrl?: string;
  travelBrief?: {
    accommodations?: Array<{
      location: string;
      days: string;
      nights: number;
      roomType: string;
      boardBasis: string;
    }>;
  };
}

export default function Map({ locations = [], mapUrl, travelBrief }: MapProps) {
  const [validatedMapUrl, setValidatedMapUrl] = useState<string>('');
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!mapUrl) {
      setMapError(true);
      return;
    }

    try {
      // Check if it's a Google Maps embed URL (contains /maps/embed)
      if (mapUrl.includes('/maps/embed')) {
        setValidatedMapUrl(mapUrl);
        setMapError(false);
        return;
      }

      // For regular Google Maps URLs, attempt to extract location and convert to embed format
      // In a real app, you would use Google Maps Embed API with a proper API key
      
      // Just use the provided URL and clean any encoding issues
      const cleanUrl = mapUrl.replace(/&#39;/g, "'");
      setValidatedMapUrl(cleanUrl);
      setMapError(false);
    } catch (error) {
      console.error('Error processing map URL:', error);
      setMapError(true);
    }
  }, [mapUrl]);

  // Get accommodation locations from travel brief
  const accommodationLocations = travelBrief?.accommodations || [];

  return (
    <div className={styles.container}>
      <div className={styles.stickyHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Journey Map</h2>
        </div>
      </div>
      
      <div className={styles.mainContent}>
        <div className={styles.mapWrapper}>
          {!mapError && validatedMapUrl ? (
            <iframe
              src={validatedMapUrl}
              className={styles.map}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              title="Trip Map"
            />
          ) : (
            <div className={styles.mapError}>
              <p>Unable to load map. Please provide a valid Google Maps URL.</p>
              <p className={styles.mapErrorHint}>
                Example: https://www.google.com/maps/embed?pb=...
              </p>
            </div>
          )}
        </div>

        {accommodationLocations.length > 0 ? (
          <div className={styles.locationList}>
            {accommodationLocations.map((item, index) => (
              <div key={index} className={styles.locationItem}>
                <div className={styles.locationMarker}>
                  <span className={styles.markerNumber}>{index + 1}</span>
                </div>
                <div className={styles.locationInfo}>
                  <div className={styles.locationName}>{item.location}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-4">
            No accommodation locations available.
          </p>
        )}
      </div>
    </div>
  );
}
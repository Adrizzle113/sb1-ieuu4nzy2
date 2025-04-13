import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Hotel, FileText } from 'lucide-react';
import styles from './TravelBrief.module.css';

interface TravelBriefProps {
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

export default function TravelBrief({ travelBrief }: TravelBriefProps) {
  const hasFlightInfo = travelBrief?.flights && (
    travelBrief.flights.arrival ||
    travelBrief.flights.departure ||
    travelBrief.flights.notes
  );

  if (!travelBrief) {
    return (
      <section className={styles.container} id="travel-brief">
        <div className={styles.stickyHeader}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>Travel Brief</h2>
          </div>
        </div>
        <div className={styles.mainContent}>
          <p className="text-muted-foreground text-center">No travel brief available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container} id="travel-brief">
      <div className={styles.stickyHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Travel Brief</h2>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.card}>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className={styles.tabsList}>
              <TabsTrigger value="overview" className={styles.tabsTrigger}>
                <FileText className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="flights" className={styles.tabsTrigger}>
                <Plane className="h-4 w-4 mr-2" />
                Flights
              </TabsTrigger>
              <TabsTrigger value="accommodations" className={styles.tabsTrigger}>
                <Hotel className="h-4 w-4 mr-2" />
                Accommodations
              </TabsTrigger>
            </TabsList>

            <div className={styles.tabsContent}>
              <TabsContent value="overview">
                <p className={styles.text}>
                  {travelBrief.description || 'No overview information available.'}
                </p>
              </TabsContent>

              <TabsContent value="flights">
                <div className="space-y-4">
                  {hasFlightInfo ? (
                    <>
                      {travelBrief.flights?.arrival && (
                        <div className={styles.flightInfo}>
                          <h3 className={styles.subtitle}>Arrival</h3>
                          <div className={styles.text}>
                            {travelBrief.flights.arrival}
                          </div>
                        </div>
                      )}

                      {travelBrief.flights?.departure && (
                        <div className={styles.flightInfo}>
                          <h3 className={styles.subtitle}>Departure</h3>
                          <div className={styles.text}>
                            {travelBrief.flights.departure}
                          </div>
                        </div>
                      )}

                      {travelBrief.flights?.notes && (
                        <div className={styles.flightInfo}>
                          <h3 className={styles.subtitle}>Additional Notes</h3>
                          <div className={styles.text}>
                            {travelBrief.flights.notes}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className={styles.text}>No flight information available.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="accommodations">
                {travelBrief.accommodations && travelBrief.accommodations.length > 0 ? (
                  <div className="space-y-4">
                    {travelBrief.accommodations.map((accommodation, index) => (
                      <div key={index} className={styles.accommodationInfo}>
                        <div className={styles.accommodationHeader}>
                          <h3 className={styles.subtitle}>{accommodation.location}</h3>
                          <span className={styles.days}>{accommodation.days}</span>
                        </div>
                        <div className={styles.accommodationDetails}>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Nights</span>
                            <span className={styles.detailValue}>
                              {accommodation.nights}
                            </span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Room Type</span>
                            <span className={styles.detailValue}>
                              {accommodation.roomType}
                            </span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Board Basis</span>
                            <span className={styles.detailValue}>
                              {accommodation.boardBasis}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.text}>No accommodation information available.</p>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
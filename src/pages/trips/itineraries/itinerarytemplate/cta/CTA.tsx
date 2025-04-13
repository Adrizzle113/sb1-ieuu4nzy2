import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatCurrency } from '@/lib/utils';
import type { TripSummary } from '@/types/luxuryTrip.types';
import styles from './CTA.module.css';

interface CTAProps {
  tripData: TripSummary;
}

export function CTA({ tripData }: CTAProps) {
  const handleBookNow = () => {
    window.location.href = `/trips/${tripData.id}/book`;
  };

  // Calculate deposit amount with safe access
  const depositAmount = (() => {
    if (!tripData.pricing?.deposit) return 0;
    if (tripData.pricing.depositType === 'percentage') {
      return ((tripData.pricing.basePrice || 0) * tripData.pricing.deposit) / 100;
    }
    return tripData.pricing.deposit;
  })();

  // Check if we should show pricing section
  const basePrice = tripData.pricing?.basePrice || 0;
  const showPricing = basePrice > 0;

  // Get all unique destinations
  const allDestinations = Array.from(new Set([
    ...(tripData.destinations || []),
    ...(tripData.travelBrief?.accommodations?.map(acc => acc.location) || [])
  ])).filter(Boolean);

  return (
    <div className={styles.container}>
      <div className={styles.stickyHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Begin Your Journey</h1>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.sectionContent}>
          <div className={styles.summarySection}>
            {tripData.duration && (
              <div className={styles.summaryBlock}>
                <h4 className={styles.summaryTitle}>Duration</h4>
                <p className={styles.summaryText}>{tripData.duration}</p>
              </div>
            )}
            
            {tripData.startDate && (
              <div className={styles.summaryBlock}>
                <h4 className={styles.summaryTitle}>Start Date</h4>
                <p className={styles.summaryText}>{tripData.startDate}</p>
              </div>
            )}
            
            {allDestinations.length > 0 && (
              <div className={styles.summaryBlock}>
                <h4 className={styles.summaryTitle}>Destinations</h4>
                <div className={styles.destinationList}>
                  {allDestinations.map((destination, index) => (
                    <span key={index} className={styles.destination}>
                      {destination}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Section */}
          {showPricing && (
            <div className={styles.pricingSection}>
              <h4 className={styles.pricingTitle}>Investment</h4>
              <div className={styles.pricingDetails}>
                <div className={styles.priceBlock}>
                  <span className={styles.priceLabel}>Total Experience</span>
                  <span className={styles.priceAmount}>
                    {formatCurrency(basePrice)}
                  </span>
                </div>
                {tripData.pricing?.deposit && depositAmount > 0 && (
                  <div className={styles.depositBlock}>
                    <span className={styles.depositLabel}>Required Deposit</span>
                    <span className={styles.depositAmount}>
                      {tripData.pricing.depositType === 'percentage' 
                        ? `${tripData.pricing.deposit}% (${formatCurrency(depositAmount)})`
                        : formatCurrency(depositAmount)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Highlights Section */}
          {tripData.highlights?.length > 0 && (
            <div className={styles.highlightsSection}>
              <h4 className={styles.highlightsTitle}>Trip Highlights</h4>
              <div className={styles.highlightsList}>
                {tripData.highlights.map((highlight, index) => (
                  <div key={index} className={styles.highlightItem}>
                    <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    <span className={styles.highlightText}>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.bookingSection}>
            <Button 
              onClick={handleBookNow}
              size="lg"
              className="w-full bg-[#17403a] hover:bg-[#0f2d28] text-white sm:w-auto"
            >
              Book Your Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import styles from './Terms.module.css';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface TermsProps {
  customTerms?: string[];
}

const policies = [
  {
    days: '60+',
    detail: 'days before travel',
    penalty: '25% deposit forfeited'
  },
  {
    days: '28-60',
    detail: 'days before travel',
    penalty: '50% of total cost forfeited'
  },
  {
    days: '<28',
    detail: 'days before travel',
    penalty: '100% of total cost forfeited'
  }
];

export default function Terms({ customTerms }: TermsProps) {
  const renderCustomTerms = () => {
    if (!customTerms?.length) return null;

    return customTerms.map((term, index) => (
      <div key={index} className={styles.termsSection}>
        <div className={styles.card}>
          <p className={styles.text}>{term}</p>
        </div>
      </div>
    ));
  };

  return (
    <section className={styles.container} id="terms">
      <div className={styles.stickyHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Terms & Conditions</h2>
        </div>
      </div>
      
      <div className={styles.mainContent}>
        {customTerms ? (
          <>
            {renderCustomTerms()}
            <div className={styles.noticeSection}>
              <AlertTriangle className={styles.warningIcon} />
              <div>
                <h4 className={styles.noticeTitle}>Important Notice</h4>
                <p className={styles.noticeText}>
                  All terms and conditions specified above are binding. Please review carefully before proceeding.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.termsSection}>
              <h3 className={styles.sectionTitle}>Payment Terms</h3>
              <div className={styles.card}>
                <p className={styles.text}>To confirm your safari, we require:</p>
                <ul className={styles.list}>
                  <li>25% deposit of the final quotation</li>
                  <li>Full payment for all flights (international, regional, domestic)</li>
                  <li>Balance is due 60 days before departure</li>
                </ul>
              </div>
            </div>

            <div className={styles.termsSection}>
              <h3 className={styles.sectionTitle}>Cancellation Policy</h3>
              <div className={styles.card}>
                <div className={styles.policyGrid}>
                  {policies.map((policy, index) => (
                    <div key={index} className={styles.policyCard}>
                      <span className={styles.daysText}>{policy.days}</span>
                      <span className={styles.detailText}>{policy.detail}</span>
                      <span className={styles.penaltyText}>{policy.penalty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.termsSection}>
              <h3 className={styles.sectionTitle}>Required Insurance</h3>
              <div className={styles.card}>
                <p className={styles.text}>We highly recommend our guests enroll with:</p>
                <ul className={styles.list}>
                  <li>Global Rescue membership</li>
                  <li>IMG Signature travel insurance</li>
                </ul>
              </div>
            </div>

            <div className={styles.noticeSection}>
              <AlertTriangle className={styles.warningIcon} />
              <div>
                <h4 className={styles.noticeTitle}>Important Notice</h4>
                <p className={styles.noticeText}>
                  Deposits are non-refundable. No refunds will be made for unused portions 
                  of your itinerary due to cancellations or changes made by participants.
                </p>
              </div>
            </div>
          </>
        )}

        <a href="/full-terms" className={styles.fullTermsLink}>
          View Full Terms & Conditions 
          <ArrowRight className={styles.arrowIcon} />
        </a>
      </div>
    </section>
  );
}
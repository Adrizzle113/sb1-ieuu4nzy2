import React from 'react';
import { Check, X } from 'lucide-react';
import styles from './WhatsIncluded.module.css';

interface WhatsIncludedProps {
  inclusions?: string[];
  exclusions?: string[];
}

export default function WhatsIncluded({
  inclusions = [],
  exclusions = []
}: WhatsIncludedProps) {
  return (
    <div className={styles.container}>
      <div className={styles.stickyHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>What's Included</h2>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.included}>
          <h3 className={styles.subtitle}>Inclusions</h3>
          <div className={styles.listContainer}>
            {inclusions.map((item, index) => (
              <div key={index} className={styles.listItem}>
                <div className={styles.checkmark}>
                  <Check size={16} />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.excluded}>
          <h3 className={styles.subtitle}>Exclusions</h3>
          <div className={styles.listContainer}>
            {exclusions.map((item, index) => (
              <div key={index} className={styles.listItem}>
                <div className={styles.cross}>
                  <X size={16} />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
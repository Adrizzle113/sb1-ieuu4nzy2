import { useEffect, useState } from 'react';
import { Menu, Link as LinkIcon, FileText, Mail, Check, Compass } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { AdminTrip } from '@/types/admin.types';
import styles from './ItineraryNavigation.module.css';

const ItineraryNavigationItems = [
  { label: 'Overview', id: 'overview' },
  { label: 'Travel Brief', id: 'travel-brief' },
  { label: 'Map', id: 'locations' },
  { label: "What's Included", id: 'inclusions' },
  { label: 'Itinerary', id: 'itinerary' },
  { label: 'Book Now', id: 'cta' },
  { label: 'Terms & Conditions', id: 'terms' },
];

interface ItineraryNavigationProps {
  tripData: AdminTrip;
}

export default function ItineraryNavigation({ tripData }: ItineraryNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleNavClick = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleGeneratePdf = async () => {
    try {
      setGeneratingPdf(true);
      // PDF generation logic would go here
      console.log('Generating PDF...');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const renderTooltip = (children: React.ReactNode, content: string) => (
    <div className={styles.tooltipContainer}>
      {children}
      <div className={styles.tooltip}>{content}</div>
    </div>
  );

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <div className={styles.navGroup}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={styles.navButton}
            aria-label="Toggle menu"
          >
            <Menu className={styles.navIcon} />
          </button>
        </div>
        
        <div className={styles.logoContainer}>
          <Compass className="h-8 w-8 text-primary" />
        </div>
        
        <div className={styles.navGroup}>
          <button 
            className={styles.navButton}
            onClick={handleCopyLink}
            disabled={copied}
            aria-label="Copy link"
          >
            {copied ? (
              <Check className={`${styles.navIcon} text-green-500`} />
            ) : (
              <LinkIcon className={styles.navIcon} />
            )}
          </button>

          <button 
            className={styles.navButton}
            onClick={handleGeneratePdf}
            disabled={generatingPdf}
            aria-label="Generate PDF"
          >
            <FileText className={`${styles.navIcon} ${generatingPdf ? 'animate-pulse' : ''}`} />
          </button>

          <button 
            className={styles.navButton}
            onClick={() => setIsContactOpen(true)}
            aria-label="Contact advisor"
          >
            <Mail className={styles.navIcon} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className={styles.menuDropdown}>
          <nav className={styles.menuNav}>
            {ItineraryNavigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={styles.menuLink}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </nav>
  );
}
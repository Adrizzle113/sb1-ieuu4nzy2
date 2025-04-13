import { useState, useCallback } from 'react';
import { parseDBDate, formatDBDate } from '@/lib/utils';

interface DateSyncOptions {
  onError?: (error: Error) => void;
}

export function useDateSync(options: DateSyncOptions = {}) {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => {
    setError(error);
    if (options.onError) {
      options.onError(error);
    }
  }, [options]);

  const toDBDate = useCallback((date: Date | null): string | null => {
    if (!date) return null;
    try {
      return formatDBDate(date);
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to format date for DB'));
      return null;
    }
  }, [handleError]);

  const fromDBDate = useCallback((dateString: string | null): Date | null => {
    if (!dateString) return null;
    try {
      return parseDBDate(dateString);
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to parse date from DB'));
      return null;
    }
  }, [handleError]);

  const validateDateRange = useCallback((startDate: Date, endDate: Date): boolean => {
    return startDate <= endDate;
  }, []);

  return {
    toDBDate,
    fromDBDate,
    validateDateRange,
    error
  };
}
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

export function DatePicker({
  date,
  onSelect,
  label = "Pick a date",
  minDate,
  maxDate,
  disabled = false,
}: DatePickerProps) {
  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onSelect(undefined);
      return;
    }

    // Create a new date using the local date components
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();
    
    // Create a new date at midnight in the local timezone
    const normalizedDate = new Date(year, month, day);
    normalizedDate.setHours(0, 0, 0, 0);
    
    console.log('Selected date:', selectedDate.toISOString());
    console.log('Normalized date:', normalizedDate.toISOString());
    
    onSelect(normalizedDate);
  };

  // Format the date for display using the local timezone
  const formatDisplayDate = (date: Date) => {
    return format(date, "MMMM d, yyyy");
  };

  // Normalize min/max dates to midnight in local timezone
  const normalizeConstraintDate = (date: Date | undefined): Date | undefined => {
    if (!date) return undefined;
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const normalizedMinDate = normalizeConstraintDate(minDate);
  const normalizedMaxDate = normalizeConstraintDate(maxDate);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDisplayDate(date) : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={(date) => {
            if (!date) return false;
            
            const compareDate = new Date(date);
            compareDate.setHours(0, 0, 0, 0);
            
            if (normalizedMinDate && compareDate < normalizedMinDate) {
              return true;
            }
            
            if (normalizedMaxDate && compareDate > normalizedMaxDate) {
              return true;
            }
            
            return false;
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
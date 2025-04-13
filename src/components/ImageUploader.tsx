import { useState, useRef } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onImageRemove?: (index: number) => void;
  images?: { url: string }[];
  maxSize?: number; // in MB
  className?: string;
  label?: string;
  multiple?: boolean;
}

export function ImageUploader({
  onImageUpload,
  onImageRemove,
  images = [],
  maxSize = 5,
  className,
  label = "Upload Images",
  multiple = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, or WebP)');
      return false;
    }

    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const simulateUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress(i);
    }
    
    setUploading(false);
    setProgress(0);
  };

  const handleFiles = async (files: FileList) => {
    setError(null);
    
    Array.from(files).forEach(async (file) => {
      if (validateFile(file)) {
        await simulateUpload(file);
        onImageUpload(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border",
          "relative"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
        />
        
        <div className="flex flex-col items-center justify-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-sm font-medium mb-1">{label}</p>
          <p className="text-xs text-muted-foreground mb-4">
            Drop your images here or click to browse
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Choose Files
          </button>
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium mb-2">Uploading...</p>
              <div className="w-48">
                <Progress value={progress} />
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
              <img
                src={image.url}
                alt={`Upload preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {onImageRemove && (
                <button
                  type="button"
                  onClick={() => onImageRemove(index)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
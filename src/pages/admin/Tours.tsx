import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus,
  Search,
  Calendar,
  Users,
  MapPin,
  Edit,
  Trash2,
  MoreVertical,
  Filter,
  Loader2,
  Eye,
  DollarSign,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Tour = Database['public']['Tables']['tours']['Row'];

const DEFAULT_TOUR_IMAGE = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80";

export default function ToursManagement() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const fetchTours = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTours(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching tours",
        description: error instanceof Error ? error.message : "Failed to load tours",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
    
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('refresh') === 'true') {
      fetchTours();
      navigate('/admin/tours', { replace: true });
    }
  }, [location.search, navigate]);

  const handleDelete = async (tourId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', tourId);

      if (error) throw error;

      toast({
        title: "Tour deleted",
        description: "The tour has been successfully deleted.",
      });

      fetchTours();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting tour",
        description: error instanceof Error ? error.message : "Failed to delete tour",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewTour = () => {
    navigate('/admin/tours/new');
  };

  const handleViewItinerary = (tourId: string) => {
    navigate(`/tours/${tourId}/itinerary`);
  };

  const handleManualRefresh = () => {
    fetchTours();
    toast({
      title: "Refreshed",
      description: "Tour list has been refreshed",
    });
  };

  const filteredTours = tours.filter(tour =>
    tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tours Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your tour offerings
          </p>
        </div>
        <Button onClick={handleAddNewTour}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Tour
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tours..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={handleManualRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredTours.length === 0 ? (
        <div className="text-center py-12 bg-muted/10 rounded-lg">
          <p className="text-muted-foreground">
            {searchQuery ? 'No tours found matching your search.' : 'No tours available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <div key={tour.id} className="bg-card rounded-lg overflow-hidden border shadow-sm">
              <div className="aspect-[16/9] relative overflow-hidden">
                <img
                  src={tour.image_url || DEFAULT_TOUR_IMAGE}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewItinerary(tour.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Itinerary
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/admin/tours/${tour.id}`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Tour</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete "{tour.title}"? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(tour.id)}
                            >
                              Delete Tour
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{tour.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{format(new Date(tour.start_date), 'MMM dd, yyyy')} - {format(new Date(tour.end_date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Max {tour.max_participants} participants</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>${tour.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
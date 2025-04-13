import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Calendar,
  Users,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  Backpack,
  BarChart3,
  Globe,
  CreditCard,
  MessageSquare,
  Bell,
  Shield,
} from 'lucide-react';
import { RootState } from '@/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

const NavItem = ({ icon, label, href, isActive }: NavItemProps) => (
  <Link
    to={href}
    className={cn(
      'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
    )}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.user_metadata?.role === 'admin';

  const adminNavigation = [
    { icon: <Home size={20} />, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', href: '/admin/analytics' },
    { icon: <Globe size={20} />, label: 'Tours Management', href: '/admin/tours' },
    { icon: <Users size={20} />, label: 'User Management', href: '/admin/users' },
    { icon: <CreditCard size={20} />, label: 'Payments', href: '/admin/payments' },
    { icon: <MessageSquare size={20} />, label: 'Reviews', href: '/admin/reviews' },
    { icon: <Bell size={20} />, label: 'Notifications', href: '/admin/notifications' },
    { icon: <Shield size={20} />, label: 'Security', href: '/admin/security' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/admin/settings' },
  ];

  const userNavigation = [
    { icon: <Home size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Compass size={20} />, label: 'Explore Tours', href: '/tours' },
    { icon: <Calendar size={20} />, label: 'My Bookings', href: '/bookings' },
    { icon: <Backpack size={20} />, label: 'My Tours', href: '/my-tours' },
    { icon: <Users size={20} />, label: 'Profile', href: '/profile' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
  ];

  const navigation = isAdmin ? adminNavigation : userNavigation;

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full bg-card border-r transition-all duration-300',
          'flex flex-col gap-4 p-4',
          isCollapsed ? 'w-[80px]' : 'w-[280px]',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16">
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">TourGuide</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>

        {/* Role Badge */}
        {!isCollapsed && isAdmin && (
          <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium text-center">
            Admin Dashboard
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={isCollapsed ? '' : item.label}
              href={item.href}
              isActive={location.pathname === item.href}
            />
          ))}
        </nav>

        {/* User Profile */}
        <div className={cn(
          'flex items-center gap-3 p-3 border-t',
          isCollapsed ? 'justify-center' : 'justify-start'
        )}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.email}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {isAdmin ? 'Administrator' : 'User'}
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
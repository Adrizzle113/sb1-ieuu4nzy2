import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-[280px] p-6">
        <Outlet />
      </main>
    </div>
  );
}
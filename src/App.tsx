import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { store } from '@/store';
import { supabase } from '@/lib/supabase';
import { setUser, setError } from '@/store/slices/authSlice';
import AppRoutes from '@/routes';

function App() {
  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        store.dispatch(setError(error.message));
      } else {
        store.dispatch(setUser(session?.user || null));
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      store.dispatch(setUser(session?.user || null));
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="tours-theme">
        <Router>
          <AppRoutes />
          <Toaster />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
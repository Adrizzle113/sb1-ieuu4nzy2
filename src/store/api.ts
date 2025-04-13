import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/lib/supabase';

export const api = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Tours', 'Bookings', 'Users', 'Payments'],
  endpoints: () => ({}),
});
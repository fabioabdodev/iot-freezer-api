'use client';

import { Suspense } from 'react';
import { ClientDashboard } from '@/components/client-dashboard';

export default function ClientDashboardPage() {
  return (
    <Suspense fallback={null}>
      <ClientDashboard />
    </Suspense>
  );
}

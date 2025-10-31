'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminMiddleware({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token && !window.location.pathname.includes('/admin')) {
      router.push('/admin');
    }
  }, [router]);

  return <>{children}</>;
}


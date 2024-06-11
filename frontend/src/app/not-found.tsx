"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const NotFound  = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl">Redirecionando para a página inicial...</p>
    </div>
  );
};

export default NotFound ;
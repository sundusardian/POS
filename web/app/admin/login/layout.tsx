import { Suspense } from 'react';

export default function AdminLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        {children}
      </Suspense>
    </div>
  );
}

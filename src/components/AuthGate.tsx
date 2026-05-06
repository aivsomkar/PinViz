import type { ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { AuthForm } from './AuthForm';

export function AuthGate({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-md)' }}>Loading…</span>
      </div>
    );
  }

  if (!user) return <AuthForm />;
  return <>{children}</>;
}

import type { ReactNode } from "react";

// Open access mode: no password, no sign-in required — every route is public.
export function AuthGate({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

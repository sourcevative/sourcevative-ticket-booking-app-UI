


"use client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ❌ NO auth logic here
  // ❌ NO router
  // ❌ NO localStorage
  // ❌ NO role check

  return <>{children}</>;
}


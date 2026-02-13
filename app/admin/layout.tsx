

"use client";

import Navbar from "@/components/navbar";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {children}
    </div>
  );
}



// "use client";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // ❌ NO auth logic here
//   // ❌ NO router
//   // ❌ NO localStorage
//   // ❌ NO role check

//   return <>{children}</>;
// }
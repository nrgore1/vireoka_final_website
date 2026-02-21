import { Suspense } from "react";
import AdminLoginClient from "./AdminLoginClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
      <AdminLoginClient />
    </Suspense>
  );
}

import AdminLoginClient from "./AdminLoginClient";

export const metadata = {
  title: "Admin Login — Vireoka",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="max-w-md mx-auto py-16 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Login</h1>
      <AdminLoginClient />
    </main>
  );
}

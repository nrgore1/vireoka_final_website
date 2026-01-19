
import Link from "next/link";

export default function AdminInvestorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Investors</h1>
        <Link
          href="/admin/investors/audit"
          className="text-sm underline underline-offset-4"
        >
          View audit log →
        </Link>
      </div>
      {/* existing AdminInvestorsClient */}
    </div>
  );
}

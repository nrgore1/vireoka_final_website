import { redirect } from "next/navigation";

export default function ApplyPage() {
  redirect("/intelligence/request-access?role=advisor");
}

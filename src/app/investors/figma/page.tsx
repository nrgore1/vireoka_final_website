import { redirect } from "next/navigation";

export default function FigmaRedirectPage() {
  // Backward compatibility: old tab/route now renamed to Design
  redirect("/investors/design");
}

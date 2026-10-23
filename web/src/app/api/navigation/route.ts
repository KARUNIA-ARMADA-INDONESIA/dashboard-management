import { getNavigation } from "@/lib/queries/navigation";

// GET /api/navigation — group departemen + fitur, dipakai command palette.
export async function GET() {
  return Response.json(await getNavigation());
}

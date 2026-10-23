"use client";

import { useEffect } from "react";
import { featureKey } from "@/lib/hooks/use-favorites";
import { recordVisit } from "@/lib/hooks/use-recent";

/** Mencatat fitur ini ke "Terakhir Dibuka" (localStorage). Tidak merender apa pun. */
export function TrackRecentVisit({
  departmentSlug,
  slug,
}: {
  departmentSlug: string;
  slug: string;
}) {
  useEffect(() => {
    recordVisit(featureKey(departmentSlug, slug));
  }, [departmentSlug, slug]);
  return null;
}

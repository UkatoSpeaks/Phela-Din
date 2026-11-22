import type { AvatarId } from "@/components/home/Avatar";

/**
 * Which cast character represents a career (home page + ID cards).
 * Careers without one show a "Photo awaited" silhouette on their ID card.
 */
export const AVATAR_BY_CAREER: Partial<Record<string, AvatarId>> = {
  "software-engineer": "engineer",
  "doctor-mbbs": "doctor",
  "chartered-accountant": "ca",
  "civil-services": "officer",
  "content-creator": "creator",
};

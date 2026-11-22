/**
 * Who appears on the home page, and which research facts they speak.
 * Names/roles are our illustrated characters; the scene line and reality
 * check are read from content/career-profiles at build time (never typed here),
 * so they stay in sync with the research.
 */
import { getCareer, getCareerProfile } from "@/lib/content";
import type { AvatarId } from "./Avatar";

interface CastConfig {
  avatar: AvatarId;
  careerId: string;
  /** Short chip label. */
  label: string;
  name: string;
  role: string;
  /** Which of the profile's sceneIdeas to show in the speech bubble. */
  sceneIdea: number;
}

const CAST: CastConfig[] = [
  { avatar: "engineer", careerId: "software-engineer", label: "Engineer", name: "Rohan", role: "SDE-1, Bengaluru startup", sceneIdea: 2 },
  { avatar: "doctor", careerId: "doctor-mbbs", label: "Doctor", name: "Dr. Meera", role: "Junior Resident, govt. hospital", sceneIdea: 0 },
  { avatar: "ca", careerId: "chartered-accountant", label: "CA", name: "Priya", role: "Articleship trainee, Pune", sceneIdea: 0 },
  { avatar: "officer", careerId: "civil-services", label: "IAS", name: "Arjun", role: "SDM, first posting", sceneIdea: 2 },
  { avatar: "creator", careerId: "content-creator", label: "Creator", name: "Zoya", role: "Creator, month 8", sceneIdea: 0 },
];

export interface CastMember extends Omit<CastConfig, "sceneIdea"> {
  careerName: string;
  /** e.g. "Hour 26 of a 36-hour shift" (from the profile's scene ideas). */
  scene: string;
  /** e.g. "~1.37–1.41 lakh MBBS seats… roughly 1 seat for every 16 registrants" (may be absent). */
  reality?: string;
  live: boolean;
}

/** Server-only (reads content). Pass the result to client components as props. */
export function getCast(): CastMember[] {
  return CAST.map(({ sceneIdea, ...c }) => {
    const career = getCareer(c.careerId);
    const profile = getCareerProfile(c.careerId);
    if (!career || !profile) throw new Error(`Home cast: missing career or profile for "${c.careerId}"`);
    const scene = profile.sceneIdeas[sceneIdea];
    if (!scene) throw new Error(`Home cast: ${c.careerId} has no sceneIdeas[${sceneIdea}]`);
    return {
      ...c,
      careerName: career.name,
      scene,
      reality: profile.competitionReality?.reality,
      live: career.status === "live",
    };
  });
}

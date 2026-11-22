/**
 * The cast: five original, bitmoji-style characters for the launch careers.
 * One family: same head/face/shoulder construction, different hair, outfit
 * and prop. Flat ink-on-paper style, matching Tiffin (docs/design.md §1).
 *
 * Pure SVG (no hooks) so it can render anywhere. Animation is applied by the
 * parent via class names: .av-bob (whole body), .av-eyes (blink), .av-prop.
 */
export type AvatarId = "engineer" | "doctor" | "ca" | "officer" | "creator";

const INK = "#1e1a15";
const SHEET = "#fbf7ee";
const STEEL = "#a7aeb3";
const HALDI = "#f2c14e";
const KHAKI = "#c9a46a";
const KHAKI2 = "#a9834a";
const LEAF = "#3f7a4c";
const CHAI = "#b5652b";
const ROSE = "#f3b8ae";
const SKY = "#bcd3ea";
const MARGIN = "#d2453a";

const SKIN: Record<AvatarId, string> = {
  engineer: "#b07850",
  doctor: "#8e5a3a",
  ca: "#c68e64",
  officer: "#9a6644",
  creator: "#b98058",
};

const stroke = { stroke: INK, strokeWidth: 2.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

function Face({ excited, glasses }: { excited: boolean; glasses?: "rect" | "round" }) {
  return (
    <g>
      {/* cheeks */}
      <circle cx="53" cy="80" r="4.6" fill={ROSE} opacity="0.65" />
      <circle cx="87" cy="80" r="4.6" fill={ROSE} opacity="0.65" />
      {/* brows: lift when excited */}
      <g style={{ transform: excited ? "translateY(-3px)" : undefined, transition: "transform 200ms" }}>
        <path d="M54 60 Q59 57.5 65 59.5" fill="none" {...stroke} strokeWidth={2.4} />
        <path d="M75 59.5 Q81 57.5 86 60" fill="none" {...stroke} strokeWidth={2.4} />
      </g>
      {/* eyes (blink target) */}
      <g className="av-eyes" style={{ transformOrigin: "70px 70px", transformBox: "view-box" }}>
        <ellipse cx="60" cy="70" rx="3" ry="3.8" fill={INK} />
        <ellipse cx="80" cy="70" rx="3" ry="3.8" fill={INK} />
        <circle cx="61" cy="68.6" r="0.9" fill={SHEET} />
        <circle cx="81" cy="68.6" r="0.9" fill={SHEET} />
      </g>
      {glasses === "rect" ? (
        <g fill={SHEET} fillOpacity="0.25" {...stroke} strokeWidth={2.2}>
          <rect x="51" y="63" width="17" height="13" rx="4" />
          <rect x="72" y="63" width="17" height="13" rx="4" />
          <path d="M68 68 H72" fill="none" />
        </g>
      ) : glasses === "round" ? (
        <g fill={SHEET} fillOpacity="0.25" {...stroke} strokeWidth={2.2}>
          <circle cx="60" cy="70" r="7.6" />
          <circle cx="80" cy="70" r="7.6" />
          <path d="M67.6 69 Q70 67.5 72.4 69" fill="none" />
        </g>
      ) : null}
      {/* nose */}
      <path d="M70 72 q-3.2 6 1.2 7.2" fill="none" stroke={INK} strokeOpacity="0.45" strokeWidth={2} strokeLinecap="round" />
      {/* mouth */}
      {excited ? (
        <path d="M61 83 Q70 94 79 83 Z" fill={INK} {...stroke} strokeWidth={2} />
      ) : (
        <path d="M62 84 Q70 90 78 84" fill="none" {...stroke} />
      )}
    </g>
  );
}

function Head({ skin }: { skin: string }) {
  return (
    <g>
      <rect x="60" y="88" width="20" height="22" fill={skin} {...stroke} />
      <ellipse cx="42" cy="72" rx="6" ry="8" fill={skin} {...stroke} />
      <ellipse cx="98" cy="72" rx="6" ry="8" fill={skin} {...stroke} />
      <ellipse cx="70" cy="68" rx="28" ry="31" fill={skin} {...stroke} />
    </g>
  );
}

const SHOULDERS = "M14 162 C14 128 36 112 70 112 C104 112 126 128 126 162 Z";

function Engineer({ excited }: { excited: boolean }) {
  const skin = SKIN.engineer;
  return (
    <g>
      <path d={SHOULDERS} fill={SKY} {...stroke} />
      {/* hoodie drawstrings */}
      <path d="M62 118 L60 140 M78 118 L80 140" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
      <Head skin={skin} />
      {/* messy hair */}
      <path
        d="M41 68 C38 44 50 31 70 32 C91 31 104 44 99 68 C96 59 92 55 88 57 C86 48 80 46 76 51 C72 44 64 44 60 50 C56 45 49 48 48 56 C44 55 42 61 41 68 Z"
        fill={INK}
        {...stroke}
      />
      <Face excited={excited} glasses="rect" />
      {/* headphones resting on the neck */}
      <g className="av-prop">
        <path d="M44 114 Q70 134 96 114" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <rect x="35" y="106" width="13" height="16" rx="5" fill={HALDI} {...stroke} />
        <rect x="92" y="106" width="13" height="16" rx="5" fill={HALDI} {...stroke} />
      </g>
    </g>
  );
}

function Doctor({ excited }: { excited: boolean }) {
  const skin = SKIN.doctor;
  return (
    <g>
      <path d={SHOULDERS} fill={LEAF} {...stroke} />
      {/* white coat panels over green scrubs */}
      <path d="M14 162 C14 130 34 114 56 111 L66 140 L58 162 Z" fill={SHEET} {...stroke} />
      <path d="M126 162 C126 130 106 114 84 111 L74 140 L82 162 Z" fill={SHEET} {...stroke} />
      <Head skin={skin} />
      {/* hair: bun + cap */}
      <circle cx="70" cy="31" r="11" fill={INK} {...stroke} />
      <path d="M41 72 C38 47 52 36 70 36 C88 36 102 47 99 72 C96 57 86 49 70 51 C55 51 45 58 41 72 Z" fill={INK} {...stroke} />
      <Face excited={excited} />
      {/* stethoscope */}
      <g className="av-prop">
        <path d="M58 111 C53 127 57 141 70 143 C83 141 87 127 82 111" fill="none" stroke={INK} strokeWidth={3.2} strokeLinecap="round" />
        <circle cx="70" cy="148" r="6" fill={STEEL} {...stroke} />
      </g>
    </g>
  );
}

function CharteredAccountant({ excited }: { excited: boolean }) {
  const skin = SKIN.ca;
  return (
    <g>
      <path d={SHOULDERS} fill={CHAI} {...stroke} />
      {/* mandarin collar */}
      <path d="M58 112 Q70 122 82 112" fill="none" stroke={INK} strokeWidth={2.6} />
      <path d="M70 120 V150" stroke={INK} strokeWidth={2} strokeDasharray="0.1 6" strokeLinecap="round" />
      <Head skin={skin} />
      {/* braid over the shoulder */}
      <g fill={INK} {...stroke}>
        <ellipse cx="99" cy="92" rx="6" ry="8" />
        <ellipse cx="101" cy="106" rx="5.6" ry="7.6" />
        <ellipse cx="103" cy="119" rx="5.2" ry="7" />
      </g>
      <path d="M41 74 C38 47 52 36 70 36 C88 36 102 47 99 74 C97 59 90 51 72 50 L70 45 L68 50 C52 51 44 59 41 74 Z" fill={INK} {...stroke} />
      {/* pen tucked behind the ear */}
      <rect x="93" y="47" width="5" height="22" rx="1.5" fill={HALDI} {...stroke} strokeWidth={2} transform="rotate(28 95 58)" />
      <Face excited={excited} glasses="round" />
      {/* calculator */}
      <g className="av-prop">
        <rect x="84" y="126" width="32" height="34" rx="4" fill={KHAKI} {...stroke} />
        <rect x="89" y="131" width="22" height="8" rx="1.5" fill={SHEET} {...stroke} strokeWidth={1.8} />
        <g fill={INK}>
          {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={90 + c * 7.5} y={143 + r * 5.5} width="4.5" height="3" rx="1" />))}
        </g>
      </g>
    </g>
  );
}

function Officer({ excited }: { excited: boolean }) {
  const skin = SKIN.officer;
  return (
    <g>
      <path d={SHOULDERS} fill={SHEET} {...stroke} />
      {/* Nehru jacket */}
      <path d="M14 162 C14 130 34 115 60 112 L66 162 Z" fill={KHAKI2} {...stroke} />
      <path d="M126 162 C126 130 106 115 80 112 L74 162 Z" fill={KHAKI2} {...stroke} />
      <g fill={INK}>
        <circle cx="72" cy="130" r="1.8" />
        <circle cx="72" cy="142" r="1.8" />
        <circle cx="72" cy="154" r="1.8" />
      </g>
      {/* tricolour lapel pin */}
      <g transform="translate(38 128)">
        <rect width="11" height="3" fill="#e8892c" />
        <rect y="3" width="11" height="3" fill={SHEET} />
        <rect y="6" width="11" height="3" fill={LEAF} />
        <rect width="11" height="9" fill="none" stroke={INK} strokeWidth="1.2" />
      </g>
      <Head skin={skin} />
      {/* side-parted hair */}
      <path d="M42 66 C40 44 54 34 72 35 C90 36 101 46 98 66 C96 57 92 53 86 53 C76 51 62 49 54 45 C50 51 45 55 42 66 Z" fill={INK} {...stroke} />
      <Face excited={excited} />
      {/* moustache */}
      <path d="M61.5 79.6 Q66 76.6 70 78.8 Q74 76.6 78.5 79.6 Q74 81.2 70 80.3 Q66 81.2 61.5 79.6 Z" fill={INK} />
      {/* file under the arm */}
      <g className="av-prop">
        <rect x="20" y="132" width="34" height="26" rx="2" fill={KHAKI} {...stroke} transform="rotate(-8 37 145)" />
        <path d="M27 142 H45" stroke={INK} strokeWidth="1.6" transform="rotate(-8 37 145)" />
      </g>
    </g>
  );
}

function Creator({ excited }: { excited: boolean }) {
  const skin = SKIN.creator;
  return (
    <g>
      {/* ring light behind */}
      <circle cx="70" cy="66" r="56" fill="none" stroke={SHEET} strokeWidth="9" />
      <circle cx="70" cy="66" r="60.5" fill="none" stroke={INK} strokeWidth="1.6" />
      <circle cx="70" cy="66" r="51.5" fill="none" stroke={INK} strokeWidth="1.6" />
      <path d={SHOULDERS} fill={ROSE} {...stroke} />
      <path d="M58 112 Q70 124 82 112" fill="none" stroke={INK} strokeWidth={2.4} />
      <Head skin={skin} />
      {/* hair at the sides + cap */}
      <path d="M41 70 C40 60 42 56 46 54 L48 74 Z M99 70 C100 60 98 56 94 54 L92 74 Z" fill={INK} {...stroke} />
      <path d="M41 60 C41 41 55 32 71 33 C88 34 100 43 99 60 Z" fill={HALDI} {...stroke} />
      <path d="M44 56 Q70 50 96 56" fill="none" stroke={INK} strokeWidth="2" />
      <circle cx="70" cy="35" r="3" fill={INK} />
      {/* hoop earrings */}
      <circle cx="42" cy="85" r="5" fill="none" stroke={HALDI} strokeWidth="2.6" />
      <circle cx="98" cy="85" r="5" fill="none" stroke={HALDI} strokeWidth="2.6" />
      <Face excited={excited} />
      {/* phone, recording */}
      <g className="av-prop">
        <rect x="88" y="120" width="24" height="40" rx="5" fill={INK} {...stroke} transform="rotate(10 100 140)" />
        <rect x="91.5" y="125" width="17" height="28" rx="2" fill={SKY} transform="rotate(10 100 140)" />
        <circle cx="101" cy="131" r="2.6" fill={MARGIN} transform="rotate(10 100 140)" />
      </g>
    </g>
  );
}

const BODIES: Record<AvatarId, (p: { excited: boolean }) => React.ReactElement> = {
  engineer: Engineer,
  doctor: Doctor,
  ca: CharteredAccountant,
  officer: Officer,
  creator: Creator,
};

interface Props {
  id: AvatarId;
  excited?: boolean;
  /** "bust" = full character; "head" = passport-photo crop for chips. */
  crop?: "bust" | "head";
  className?: string;
  title?: string;
}

export function Avatar({ id, excited = false, crop = "bust", className = "", title }: Props) {
  const Body = BODIES[id];
  const viewBox = crop === "head" ? "22 18 96 96" : "0 0 140 164";
  return (
    <svg viewBox={viewBox} className={`block ${crop === "head" ? "overflow-hidden" : "overflow-visible"} ${className}`} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <g className="av-bob">
        <Body excited={excited} />
      </g>
    </svg>
  );
}

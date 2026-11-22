"use client";

/**
 * The 2026 desk (React Three Fiber + Drei). Loaded ONLY by DeskSection via
 * next/dynamic (ssr: false) when it scrolls into view, so Three.js never
 * ships with the simulation player or other pages.
 *
 * Look: rounded, toon-shaded shapes with ink outlines, so the 3D matches the
 * 2D cast and Tiffin (docs/design.md §1 "printed, not rendered").
 * Vibe: a 2026 Indian desk: oak top on a slim frame, felt mat, phone with a
 * notification, earbuds, steel bottle, money plant, chai in a paper cup, sticky
 * notes on the wall. Tiffin is here as our mascot desk figurine, not a lunch box.
 */
import { Float, Outlines, PresentationControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type { Group, Mesh } from "three";
import type { AvatarId } from "./Avatar";

const C = {
  ink: "#1e1a15",
  ink2: "#3a332b",
  sheet: "#fbf7ee",
  paper: "#f3ecdd",
  paper2: "#e9dfc9",
  oak: "#d9b98c",
  khaki: "#c9a46a",
  khaki2: "#a9834a",
  steel: "#b9c0c4",
  haldi: "#f2c14e",
  chai: "#b5652b",
  leaf: "#3f7a4c",
  leafLight: "#6aa36f",
  margin: "#d2453a",
  sky: "#bcd3ea",
  rose: "#f3b8ae",
  saffron: "#e8892c",
  screen: "#26211b",
};

type V3 = [number, number, number];
const OUT = 0.012; // ink outline thickness (world units)

function Mat({ color, glow = 0 }: { color: string; glow?: number }) {
  return <meshToonMaterial color={color} emissive={glow ? color : "#000000"} emissiveIntensity={glow} />;
}

/** Rounded box with an ink outline: the basic building block. */
function RB({ args, position, rotation, color, radius = 0.025, glow, outline = true }: { args: V3; position: V3; rotation?: V3; color: string; radius?: number; glow?: number; outline?: boolean }) {
  return (
    <RoundedBox args={args} radius={Math.min(radius, Math.min(...args) / 2 - 0.001)} smoothness={3} position={position} rotation={rotation} castShadow receiveShadow>
      <Mat color={color} glow={glow} />
      {outline ? <Outlines thickness={OUT} color={C.ink} /> : null}
    </RoundedBox>
  );
}

function Cyl({ r, rTop, h, position, rotation, color, seg = 18, outline = true }: { r: number; rTop?: number; h: number; position: V3; rotation?: V3; color: string; seg?: number; outline?: boolean }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[rTop ?? r, r, h, seg]} />
      <Mat color={color} />
      {outline ? <Outlines thickness={OUT} color={C.ink} /> : null}
    </mesh>
  );
}

function Ball({ r, position, color, scale }: { r: number; position: V3; color: string; scale?: V3 }) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <sphereGeometry args={[r, 18, 12]} />
      <Mat color={color} />
      <Outlines thickness={OUT} color={C.ink} />
    </mesh>
  );
}

const TOP = 1.0; // desk surface height

/** Props pop in with a springy scale whenever the career changes. */
function PopIn({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  const t = useRef(0);
  useFrame((_, dt) => {
    if (!ref.current || t.current >= 1) return;
    t.current = Math.min(1, t.current + dt * 2.6);
    const x = t.current;
    ref.current.scale.setScalar(Math.max(0.001, 1 - Math.pow(1 - x, 3) * Math.cos(x * Math.PI * 2.2)));
  });
  // Pivot at the desk surface so props grow out of the desk, not the floor.
  return (
    <group ref={ref} position={[0, TOP, 0]} scale={0.001}>
      <group position={[0, -TOP, 0]}>{children}</group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Room + desk
// ---------------------------------------------------------------------------

/** Wall clock (scenes are timed: 9:30 AM, 3:00 PM…). The minute hand turns slowly. */
function WallClock() {
  const minute = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (minute.current) minute.current.rotation.z -= dt * 0.6;
  });
  return (
    <group position={[1.15, 1.9, -1.48]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
        <Mat color={C.sheet} />
        <Outlines thickness={0.02} color={C.ink} />
      </mesh>
      <mesh position={[0, 0.07, 0.035]}>
        <boxGeometry args={[0.025, 0.15, 0.01]} />
        <Mat color={C.ink} />
      </mesh>
      <mesh ref={minute} position={[0, 0, 0.04]}>
        <boxGeometry args={[0.018, 0.44, 0.01]} />
        <Mat color={C.margin} />
      </mesh>
    </group>
  );
}

function Room() {
  return (
    <group>
      <RB args={[5.2, 0.1, 3.4]} position={[0, -0.05, 0.1]} color={C.paper2} radius={0.04} />
      <RB args={[5.2, 2.6, 0.1]} position={[0, 1.25, -1.55]} color={C.paper} radius={0.04} />
      {/* sticky notes on the wall: the app's paper theme */}
      <RB args={[0.34, 0.34, 0.012]} position={[-1.35, 1.95, -1.49]} rotation={[0, 0, 0.08]} color={C.haldi} radius={0.005} />
      <RB args={[0.34, 0.34, 0.012]} position={[-0.95, 1.85, -1.49]} rotation={[0, 0, -0.1]} color={C.rose} radius={0.005} />
      <RB args={[0.34, 0.34, 0.012]} position={[-1.15, 1.5, -1.49]} rotation={[0, 0, 0.04]} color={C.sky} radius={0.005} />
      <WallClock />
    </group>
  );
}

function Desk() {
  return (
    <group>
      {/* oak top */}
      <RB args={[3.2, 0.09, 1.6]} position={[0, TOP - 0.045, -0.1]} color={C.oak} radius={0.04} />
      {/* slim metal T-frame legs */}
      {[-1.4, 1.4].map((x) => (
        <group key={x}>
          <RB args={[0.07, TOP - 0.09, 0.07]} position={[x, (TOP - 0.09) / 2, -0.1]} color={C.ink2} radius={0.02} />
          <RB args={[0.09, 0.05, 1.3]} position={[x, 0.025, -0.1]} color={C.ink2} radius={0.02} />
          <RB args={[0.06, 0.05, 1.3]} position={[x, TOP - 0.115, -0.1]} color={C.ink2} radius={0.02} />
        </group>
      ))}
      {/* felt desk mat */}
      <RB args={[1.9, 0.012, 0.8]} position={[0, TOP + 0.006, 0.1]} color={C.ink2} radius={0.005} outline={false} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Things on every 2026 desk
// ---------------------------------------------------------------------------

/** Our mascot as a collectible desk toy: same three tiers, same face. */
function TiffinFigurine() {
  return (
    <Float speed={2.2} rotationIntensity={0.25} floatIntensity={0.3} floatingRange={[0, 0.05]}>
      <group position={[1.22, TOP, 0.35]} rotation={[0, -0.5, 0]} scale={0.62}>
        <Cyl r={0.26} h={0.04} position={[0, 0.02, 0]} color={C.ink2} />
        <Cyl r={0.2} h={0.15} position={[0, 0.115, 0]} color={C.haldi} />
        <Cyl r={0.2} h={0.15} position={[0, 0.27, 0]} color={C.steel} />
        <Cyl r={0.2} h={0.2} position={[0, 0.45, 0]} color={C.steel} />
        <Ball r={0.205} position={[0, 0.55, 0]} color={C.steel} scale={[1, 0.42, 1]} />
        <Cyl r={0.05} h={0.05} position={[0, 0.64, 0]} color={C.steel} />
        <Ball r={0.03} position={[-0.07, 0.47, 0.19]} color={C.ink} scale={[1, 1.3, 0.5]} />
        <Ball r={0.03} position={[0.07, 0.47, 0.19]} color={C.ink} scale={[1, 1.3, 0.5]} />
        <RB args={[0.035, 0.5, 0.035]} position={[-0.25, 0.37, 0]} color={C.ink} radius={0.015} outline={false} />
        <RB args={[0.035, 0.5, 0.035]} position={[0.25, 0.37, 0]} color={C.ink} radius={0.015} outline={false} />
        <mesh position={[0, 0.62, 0]}>
          <torusGeometry args={[0.25, 0.018, 8, 20, Math.PI]} />
          <Mat color={C.ink} />
        </mesh>
      </group>
    </Float>
  );
}

function Everyday() {
  return (
    <group>
      {/* money plant in a pot */}
      <group position={[-1.32, TOP, -0.6]}>
        <Cyl r={0.13} rTop={0.16} h={0.24} position={[0, 0.12, 0]} color={C.chai} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Ball key={i} r={0.075} position={[Math.sin(i * 1.1) * 0.13, 0.32 + (i % 3) * 0.09, Math.cos(i * 1.1) * 0.1]} color={i % 2 ? C.leaf : C.leafLight} scale={[1.3, 0.6, 1]} />
        ))}
      </group>
      {/* steel water bottle */}
      <group position={[1.35, TOP, -0.55]}>
        <Cyl r={0.075} h={0.42} position={[0, 0.21, 0]} color={C.steel} />
        <Cyl r={0.06} h={0.07} position={[0, 0.455, 0]} color={C.ink2} />
      </group>
      {/* chai in a paper cup with a sleeve and lid */}
      <group position={[-1.05, TOP, 0.42]}>
        <Cyl r={0.07} rTop={0.09} h={0.22} position={[0, 0.11, 0]} color={C.sheet} />
        <Cyl r={0.083} rTop={0.088} h={0.08} position={[0, 0.13, 0]} color={C.haldi} />
        <Cyl r={0.095} h={0.025} position={[0, 0.232, 0]} color={C.chai} />
      </group>
      {/* phone, face up, with a notification */}
      <group position={[0.85, TOP, 0.5]} rotation={[0, 0.35, 0]}>
        <RB args={[0.2, 0.02, 0.4]} position={[0, 0.01, 0]} color={C.ink} radius={0.008} />
        <RB args={[0.17, 0.006, 0.36]} position={[0, 0.022, 0]} color={C.sky} radius={0.003} glow={0.25} outline={false} />
        <RB args={[0.14, 0.006, 0.06]} position={[0, 0.026, -0.12]} color={C.sheet} radius={0.003} outline={false} />
      </group>
      {/* earbuds case */}
      <RB args={[0.12, 0.06, 0.09]} position={[0.55, TOP + 0.03, 0.6]} rotation={[0, -0.4, 0]} color={C.sheet} radius={0.03} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Career kits
// ---------------------------------------------------------------------------

function Monitor({ position, width = 1.05, children }: { position: V3; width?: number; children?: ReactNode }) {
  return (
    <group position={position}>
      <RB args={[0.34, 0.025, 0.22]} position={[0, 0.0125, 0]} color={C.ink2} radius={0.01} />
      <RB args={[0.05, 0.36, 0.05]} position={[0, 0.2, -0.04]} color={C.ink2} radius={0.02} />
      <group position={[0, 0.58, 0]}>
        <RB args={[width, 0.6, 0.04]} position={[0, 0, 0]} color={C.ink} radius={0.02} />
        <group position={[0, 0, 0.022]}>{children}</group>
      </group>
    </group>
  );
}

/** Glowing text-like lines on a screen (code, notes). */
function Lines({ rows, width, colors, gap = 0.08 }: { rows: number[]; width: number; colors: string[]; gap?: number }) {
  return (
    <group>
      {rows.map((w, i) => (
        <mesh key={i} position={[-width / 2 + (w * width) / 2 + 0.05, 0.2 - i * gap, 0]}>
          <boxGeometry args={[w * width, 0.03, 0.004]} />
          <Mat color={colors[i % colors.length]!} glow={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function Laptop({ position, rotation, children }: { position: V3; rotation?: V3; children?: ReactNode }) {
  return (
    <group position={position} rotation={rotation}>
      <RB args={[0.72, 0.03, 0.48]} position={[0, 0.015, 0]} color={C.steel} radius={0.012} />
      <group position={[0, 0.03, -0.23]} rotation={[-0.25, 0, 0]}>
        <RB args={[0.72, 0.46, 0.025]} position={[0, 0.23, 0]} color={C.steel} radius={0.012} />
        <group position={[0, 0.23, 0.016]}>
          <RB args={[0.64, 0.38, 0.006]} position={[0, 0, 0]} color={C.screen} radius={0.004} outline={false} />
          <group position={[0, 0, 0.005]}>{children}</group>
        </group>
      </group>
    </group>
  );
}

function EngineerKit() {
  return (
    <group>
      <Monitor position={[0, TOP, -0.5]} width={1.2}>
        <Lines rows={[0.35, 0.6, 0.5, 0.75, 0.3, 0.55]} width={1.05} colors={[C.haldi, C.sky, C.rose, C.sky, C.leafLight, C.sheet]} gap={0.07} />
      </Monitor>
      {/* mechanical keyboard with colour keycaps */}
      <group position={[-0.05, TOP + 0.015, 0.12]}>
        <RB args={[0.9, 0.05, 0.3]} position={[0, 0.025, 0]} color={C.sheet} radius={0.02} />
        {[0, 1, 2].map((r) =>
          Array.from({ length: 10 }, (_, c) => (
            <RB
              key={`${r}-${c}`}
              args={[0.065, 0.035, 0.065]}
              position={[-0.36 + c * 0.08, 0.06, -0.08 + r * 0.08]}
              color={(r * 10 + c) % 7 === 0 ? C.haldi : (r * 10 + c) % 5 === 0 ? C.margin : C.paper2}
              radius={0.012}
              outline={false}
            />
          )),
        )}
      </group>
      {/* mouse + rubber duck */}
      <RB args={[0.11, 0.05, 0.17]} position={[0.6, TOP + 0.04, 0.15]} color={C.sheet} radius={0.04} />
      <group position={[0.75, TOP, -0.35]} rotation={[0, -0.6, 0]}>
        <Ball r={0.1} position={[0, 0.09, 0]} color={C.haldi} scale={[1.2, 0.9, 1]} />
        <Ball r={0.07} position={[0, 0.22, 0.05]} color={C.haldi} />
        <RB args={[0.07, 0.025, 0.06]} position={[0, 0.21, 0.13]} color={C.saffron} radius={0.01} />
      </group>
    </group>
  );
}

const ECG: [number, number, number, number][] = [
  [-0.3, 0, 0.12, 0],
  [-0.22, 0.04, 0.05, 0.9],
  [-0.18, 0.04, 0.05, -0.9],
  [-0.12, 0, 0.12, 0],
  [-0.04, 0.08, 0.16, 1.2],
  [0.03, 0.02, 0.16, -1.3],
  [0.1, 0, 0.1, 0],
  [0.2, 0.03, 0.06, 0.8],
  [0.25, 0.03, 0.06, -0.8],
];

function DoctorKit() {
  return (
    <group>
      {/* tablet on a stand showing an ECG */}
      <group position={[-0.2, TOP, -0.35]} rotation={[-0.35, 0.15, 0]}>
        <RB args={[0.8, 0.56, 0.03]} position={[0, 0.3, 0]} color={C.ink} radius={0.03} />
        <group position={[0, 0.3, 0.02]}>
          {ECG.map(([x, y, w, rot], i) => (
            <mesh key={i} position={[x, y, 0]} rotation={[0, 0, rot]}>
              <boxGeometry args={[w, 0.018, 0.004]} />
              <Mat color={C.leafLight} glow={0.6} />
            </mesh>
          ))}
        </group>
      </group>
      {/* stethoscope */}
      <mesh position={[0.45, TOP + 0.03, 0.15]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <torusGeometry args={[0.24, 0.022, 10, 32, Math.PI * 1.6]} />
        <Mat color={C.ink} />
      </mesh>
      <Cyl r={0.06} h={0.035} position={[0.7, TOP + 0.02, 0.32]} color={C.steel} />
      {/* weekly pill organiser */}
      <group position={[-0.55, TOP, 0.3]} rotation={[0, 0.2, 0]}>
        {[C.margin, C.haldi, C.sky, C.leafLight, C.rose, C.saffron, C.sheet].map((c, i) => (
          <RB key={i} args={[0.075, 0.05, 0.1]} position={[i * 0.08, 0.025, 0]} color={c} radius={0.012} />
        ))}
      </group>
    </group>
  );
}

function CaKit() {
  return (
    <group>
      <Monitor position={[-0.1, TOP, -0.5]} width={1.15}>
        {/* spreadsheet grid */}
        <RB args={[1.05, 0.5, 0.005]} position={[0, 0, 0]} color={C.sheet} radius={0.004} outline={false} glow={0.15} />
        {[0, 1, 2, 3, 4].map((r) =>
          [0, 1, 2, 3, 4, 5].map((c) => (
            <mesh key={`${r}${c}`} position={[-0.42 + c * 0.17, 0.18 - r * 0.09, 0.005]}>
              <boxGeometry args={[0.15, 0.07, 0.003]} />
              <Mat color={r === 0 ? C.leaf : (r + c) % 4 === 0 ? C.haldi : C.paper2} />
            </mesh>
          )),
        )}
      </Monitor>
      {/* calculator */}
      <group position={[0.6, TOP, 0.2]} rotation={[0, -0.3, 0]}>
        <RB args={[0.32, 0.05, 0.44]} position={[0, 0.025, 0]} color={C.khaki} radius={0.02} />
        <RB args={[0.24, 0.01, 0.09]} position={[0, 0.055, -0.14]} color={C.sheet} radius={0.004} outline={false} />
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => <RB key={`${r}${c}`} args={[0.06, 0.02, 0.05]} position={[-0.08 + c * 0.08, 0.06, -0.02 + r * 0.08]} color={C.ink2} radius={0.008} outline={false} />),
        )}
      </group>
      {/* a few client files + a receipt */}
      {[0, 1, 2].map((i) => (
        <RB key={i} args={[0.6, 0.045, 0.42]} position={[-0.75, TOP + 0.025 + i * 0.05, 0.25]} rotation={[0, i % 2 ? 0.1 : -0.08, 0]} color={i % 2 ? C.khaki : C.khaki2} radius={0.01} />
      ))}
      <RB args={[0.16, 0.008, 0.28]} position={[0.15, TOP + 0.005, 0.38]} rotation={[0, 0.5, 0]} color={C.sheet} radius={0.003} />
    </group>
  );
}

function RingingPhone({ position }: { position: V3 }) {
  const ring = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const t = (clock.elapsedTime * 1.4) % 1;
    ring.current.scale.setScalar(1 + t * 1.6);
    (ring.current.material as { opacity: number }).opacity = 1 - t;
  });
  return (
    <group position={position} rotation={[0, -0.3, 0]}>
      <RB args={[0.2, 0.02, 0.4]} position={[0, 0.01, 0]} color={C.ink} radius={0.008} />
      <RB args={[0.17, 0.006, 0.36]} position={[0, 0.022, 0]} color={C.leafLight} radius={0.003} glow={0.5} outline={false} />
      <mesh ref={ring} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.225, 32]} />
        <meshBasicMaterial color={C.leaf} transparent />
      </mesh>
    </group>
  );
}

const CALL_TILES: [number, number, string][] = [
  [-0.155, 0.095, C.sky],
  [0.155, 0.095, C.rose],
  [-0.155, -0.095, C.haldi],
  [0.155, -0.095, C.leafLight],
];

function OfficerKit() {
  return (
    <group>
      {/* laptop on a video call */}
      <Laptop position={[0.05, TOP, -0.15]}>
        {CALL_TILES.map(([x, y, c], i) => (
          <mesh key={i} position={[x, y, 0]}>
            <boxGeometry args={[0.29, 0.17, 0.003]} />
            <Mat color={c} glow={0.25} />
          </mesh>
        ))}
      </Laptop>
      {/* tied file stack: still very real in 2026 */}
      {[0, 1, 2, 3, 4].map((i) => (
        <RB key={i} args={[0.6, 0.06, 0.44]} position={[-0.85, TOP + 0.03 + i * 0.065, -0.2]} rotation={[0, i % 2 ? 0.07 : -0.05, 0]} color={i % 2 ? C.khaki : C.khaki2} radius={0.01} />
      ))}
      <RB args={[0.025, 0.34, 0.46]} position={[-0.85, TOP + 0.17, -0.2]} color={C.margin} radius={0.005} outline={false} />
      {/* desk flag */}
      <group position={[0.75, TOP, -0.55]}>
        <Cyl r={0.06} h={0.03} position={[0, 0.015, 0]} color={C.ink2} />
        <Cyl r={0.012} h={0.5} position={[0, 0.25, 0]} color={C.ink2} seg={8} outline={false} />
        <RB args={[0.28, 0.06, 0.008]} position={[0.15, 0.46, 0]} color={C.saffron} radius={0.002} />
        <RB args={[0.28, 0.06, 0.008]} position={[0.15, 0.4, 0]} color={C.sheet} radius={0.002} />
        <RB args={[0.28, 0.06, 0.008]} position={[0.15, 0.34, 0]} color={C.leaf} radius={0.002} />
      </group>
      <RingingPhone position={[-0.4, TOP, 0.35]} />
    </group>
  );
}

const TIMELINE: [number, string, number][] = [
  [0.5, C.rose, 0.1],
  [0.35, C.sky, 0.03],
  [0.45, C.haldi, -0.04],
  [0.25, C.leafLight, -0.11],
];

function CreatorKit() {
  return (
    <group>
      {/* phone on a tripod in front of a ring light */}
      <group position={[-0.45, TOP, -0.35]}>
        {[0, 1, 2].map((i) => {
          const a = (i * Math.PI * 2) / 3;
          return <Cyl key={i} r={0.012} h={0.5} position={[Math.sin(a) * 0.1, 0.24, Math.cos(a) * 0.1]} rotation={[Math.cos(a) * 0.25, 0, -Math.sin(a) * 0.25]} color={C.ink2} seg={6} outline={false} />;
        })}
        <mesh position={[0, 0.78, -0.05]}>
          <torusGeometry args={[0.34, 0.035, 12, 40]} />
          <Mat color={C.sheet} glow={0.7} />
          <Outlines thickness={OUT} color={C.ink} />
        </mesh>
        <RB args={[0.22, 0.42, 0.025]} position={[0, 0.78, 0]} color={C.ink} radius={0.02} />
        <RB args={[0.18, 0.36, 0.005]} position={[0, 0.78, 0.016]} color={C.rose} radius={0.01} glow={0.3} outline={false} />
        <Ball r={0.02} position={[0.05, 0.92, 0.02]} color={C.margin} />
      </group>
      {/* mic on a boom arm */}
      <group position={[0.05, TOP, -0.45]}>
        <Cyl r={0.04} h={0.12} position={[0, 0.06, 0]} color={C.ink2} />
        <RB args={[0.03, 0.03, 0.55]} position={[0, 0.25, 0.2]} rotation={[0.55, 0, 0]} color={C.ink2} radius={0.012} outline={false} />
        <Cyl r={0.06} h={0.2} position={[0, 0.42, 0.42]} rotation={[0.3, 0, 0]} color={C.ink} />
      </group>
      {/* editing timeline on a laptop */}
      <Laptop position={[0.55, TOP, 0.15]} rotation={[0, -0.35, 0]}>
        {TIMELINE.map(([w, c, y], i) => (
          <mesh key={i} position={[-0.25 + w / 2 + (i % 2) * 0.05, y, 0]}>
            <boxGeometry args={[w, 0.05, 0.003]} />
            <Mat color={c} glow={0.3} />
          </mesh>
        ))}
      </Laptop>
    </group>
  );
}

const KITS: Record<AvatarId, () => React.ReactElement> = {
  engineer: EngineerKit,
  doctor: DoctorKit,
  ca: CaKit,
  officer: OfficerKit,
  creator: CreatorKit,
};

export default function DeskScene({ career, active }: { career: AvatarId; active: boolean }) {
  const Kit = KITS[career];
  return (
    <Canvas
      shadows
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.6]}
      camera={{ position: [2.0, 2.45, 3.9], fov: 38 }}
      gl={{ antialias: true }}
      onCreated={({ camera }) => camera.lookAt(0, 0.85, -0.25)}
      aria-hidden
    >
      <color attach="background" args={[C.paper]} />
      <hemisphereLight args={["#fff7e8", "#d9b98c", 1.5]} />
      <directionalLight
        position={[2.5, 5, 3]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0008}
      />
      <PresentationControls global={false} cursor snap polar={[-0.12, 0.2]} azimuth={[-0.5, 0.5]} speed={1.4}>
        <group position={[0, -0.45, 0]}>
          <Room />
          <Desk />
          <Everyday />
          <TiffinFigurine />
          <PopIn key={career}>
            <Kit />
          </PopIn>
        </group>
      </PresentationControls>
    </Canvas>
  );
}

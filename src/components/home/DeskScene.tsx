"use client";

/**
 * Low-poly desk diorama (React Three Fiber + Drei). Loaded ONLY by
 * DeskSection via next/dynamic (ssr: false) when it scrolls into view, so
 * Three.js never ships with the simulation player or other pages.
 *
 * Flat-shaded primitives in the palette: printed-toy look, not realism.
 */
import { ContactShadows, Edges, Float, PresentationControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";
import type { AvatarId } from "./Avatar";

const C = {
  ink: "#1e1a15",
  sheet: "#fbf7ee",
  paper2: "#e9dfc9",
  khaki: "#c9a46a",
  khaki2: "#a9834a",
  steel: "#a7aeb3",
  haldi: "#f2c14e",
  chai: "#b5652b",
  leaf: "#3f7a4c",
  margin: "#d2453a",
  sky: "#bcd3ea",
  rose: "#f3b8ae",
  wood: "#8a5a35",
  saffron: "#e8892c",
};

function M({ color, emissive }: { color: string; emissive?: number }) {
  return <meshStandardMaterial color={color} flatShading roughness={0.85} metalness={0} emissive={emissive ? color : "#000"} emissiveIntensity={emissive ?? 0} />;
}

function Box({ args, position, rotation, color }: { args: [number, number, number]; position: [number, number, number]; rotation?: [number, number, number]; color: string }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <M color={color} />
      <Edges color={C.ink} threshold={20} />
    </mesh>
  );
}

function Cyl({ r, rTop, h, position, rotation, color, seg = 10 }: { r: number; rTop?: number; h: number; position: [number, number, number]; rotation?: [number, number, number]; color: string; seg?: number }) {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[rTop ?? r, r, h, seg]} />
      <M color={color} />
      <Edges color={C.ink} threshold={50} />
    </mesh>
  );
}

const TOP = 1.06; // desk surface height

/** Props pop in with a springy scale whenever the career changes. */
function PopIn({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  const t = useRef(0);
  useFrame((_, dt) => {
    if (!ref.current || t.current >= 1) return;
    t.current = Math.min(1, t.current + dt * 2.6);
    const x = t.current;
    const s = 1 - Math.pow(1 - x, 3) * Math.cos(x * Math.PI * 2.2); // overshooting ease
    ref.current.scale.setScalar(Math.max(0.001, s));
  });
  // Pivot at the desk surface so props grow out of the desk, not the floor.
  return (
    <group ref={ref} position={[0, TOP, 0]} scale={0.001}>
      <group position={[0, -TOP, 0]}>{children}</group>
    </group>
  );
}

function Desk() {
  return (
    <group>
      {/* floor tile */}
      <Box args={[4.6, 0.12, 3.2]} position={[0, -0.06, 0]} color={C.paper2} />
      {/* desk */}
      <Box args={[3.3, 0.12, 1.7]} position={[0, TOP - 0.06, 0]} color={C.wood} />
      {[-1.5, 1.5].map((x) => [-0.7, 0.7].map((z) => <Box key={`${x}${z}`} args={[0.1, TOP - 0.12, 0.1]} position={[x, (TOP - 0.12) / 2, z]} color={C.ink} />))}
    </group>
  );
}

function TiffinProp() {
  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.25} floatingRange={[0, 0.06]}>
      <group position={[1.15, TOP, 0.3]} scale={0.72}>
        <Cyl r={0.2} h={0.16} position={[0, 0.08, 0]} color={C.steel} />
        <Cyl r={0.205} h={0.025} position={[0, 0.165, 0]} color={C.ink} />
        <Cyl r={0.2} h={0.16} position={[0, 0.26, 0]} color={C.steel} />
        <Cyl r={0.205} h={0.025} position={[0, 0.345, 0]} color={C.ink} />
        <Cyl r={0.2} h={0.18} position={[0, 0.45, 0]} color={C.steel} />
        <mesh position={[0, 0.54, 0]} scale={[1, 0.45, 1]}>
          <sphereGeometry args={[0.21, 10, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <M color={C.steel} />
        </mesh>
        {/* carrier bars + handle */}
        <Box args={[0.03, 0.56, 0.03]} position={[-0.23, 0.32, 0]} color={C.ink} />
        <Box args={[0.03, 0.56, 0.03]} position={[0.23, 0.32, 0]} color={C.ink} />
        <mesh position={[0, 0.6, 0]}>
          <torusGeometry args={[0.23, 0.018, 4, 12, Math.PI]} />
          <M color={C.ink} />
        </mesh>
        {/* face: two eyes */}
        <Box args={[0.04, 0.06, 0.01]} position={[-0.07, 0.47, 0.201]} color={C.ink} />
        <Box args={[0.04, 0.06, 0.01]} position={[0.07, 0.47, 0.201]} color={C.ink} />
      </group>
    </Float>
  );
}

function ChaiGlass() {
  return (
    <group position={[-1.3, TOP, 0.45]}>
      {/* cutting chai: brown tea in a small glass, pale rim at the top */}
      <Cyl r={0.08} rTop={0.095} h={0.17} position={[0, 0.085, 0]} color={C.chai} seg={8} />
      <Cyl r={0.095} rTop={0.1} h={0.05} position={[0, 0.195, 0]} color={C.sheet} seg={8} />
    </group>
  );
}

function EngineerProps() {
  return (
    <group>
      {/* laptop */}
      <Box args={[1.0, 0.04, 0.66]} position={[-0.15, TOP + 0.02, 0.05]} color={C.steel} />
      <group position={[-0.15, TOP + 0.04, -0.28]} rotation={[-0.28, 0, 0]}>
        <Box args={[1.0, 0.64, 0.035]} position={[0, 0.32, 0]} color={C.steel} />
        <Box args={[0.9, 0.54, 0.01]} position={[0, 0.33, 0.02]} color={C.ink} />
        {/* code lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Box key={i} args={[0.25 + ((i * 37) % 40) / 100, 0.035, 0.01]} position={[-0.25 + ((i * 37) % 40) / 200, 0.5 - i * 0.08, 0.03]} color={[C.haldi, C.sky, C.rose, C.sky, C.leaf][i]!} />
        ))}
        {/* stickers on the lid back */}
        <Box args={[0.16, 0.16, 0.01]} position={[0.25, 0.42, -0.025]} rotation={[0, 0, 0.3]} color={C.haldi} />
        <Box args={[0.13, 0.13, 0.01]} position={[-0.25, 0.22, -0.025]} rotation={[0, 0, -0.2]} color={C.margin} />
      </group>
      {/* rubber debugging duck */}
      <group position={[0.55, TOP, -0.2]}>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.12, 8, 6]} />
          <M color={C.haldi} />
        </mesh>
        <mesh position={[0, 0.25, 0.04]}>
          <sphereGeometry args={[0.08, 8, 6]} />
          <M color={C.haldi} />
        </mesh>
        <Box args={[0.08, 0.03, 0.08]} position={[0, 0.24, 0.13]} color={C.saffron} />
      </group>
    </group>
  );
}

function DoctorProps() {
  return (
    <group>
      {/* prescription pad */}
      <Box args={[0.55, 0.04, 0.75]} position={[-0.3, TOP + 0.02, 0.05]} rotation={[0, 0.15, 0]} color={C.sheet} />
      <Box args={[0.55, 0.045, 0.14]} position={[-0.32, TOP + 0.022, -0.26]} rotation={[0, 0.15, 0]} color={C.leaf} />
      {/* stethoscope */}
      <mesh position={[0.35, TOP + 0.03, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.025, 6, 20, Math.PI * 1.6]} />
        <M color={C.ink} />
      </mesh>
      <Cyl r={0.07} h={0.04} position={[0.62, TOP + 0.02, 0.25]} color={C.steel} />
      {/* pill bottle */}
      <Cyl r={0.08} h={0.22} position={[0.1, TOP + 0.11, -0.45]} color={C.saffron} seg={8} />
      <Cyl r={0.085} h={0.06} position={[0.1, TOP + 0.25, -0.45]} color={C.sheet} seg={8} />
    </group>
  );
}

function CaProps() {
  return (
    <group>
      {/* stack of files */}
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} args={[0.75, 0.06, 0.55]} position={[-0.55, TOP + 0.03 + i * 0.065, -0.1]} rotation={[0, (i % 2 ? 0.08 : -0.06), 0]} color={i % 2 ? C.khaki : C.khaki2} />
      ))}
      {/* calculator */}
      <group position={[0.3, TOP, 0.15]} rotation={[0, -0.25, 0]}>
        <Box args={[0.42, 0.06, 0.58]} position={[0, 0.03, 0]} color={C.khaki} />
        <Box args={[0.32, 0.015, 0.12]} position={[0, 0.065, -0.19]} color={C.sheet} />
        {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <Box key={`${r}${c}`} args={[0.07, 0.02, 0.06]} position={[-0.1 + c * 0.1, 0.065, -0.03 + r * 0.1]} color={C.ink} />))}
      </group>
      {/* receipts */}
      <Box args={[0.18, 0.01, 0.3]} position={[0.75, TOP + 0.005, -0.3]} rotation={[0, 0.5, 0]} color={C.sheet} />
      <Box args={[0.18, 0.01, 0.3]} position={[0.8, TOP + 0.015, -0.25]} rotation={[0, -0.3, 0]} color={C.sheet} />
    </group>
  );
}

function OfficerProps() {
  return (
    <group>
      {/* tall file stack, tied */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Box key={i} args={[0.7, 0.07, 0.5]} position={[-0.6, TOP + 0.035 + i * 0.075, -0.15]} rotation={[0, (i % 2 ? 0.07 : -0.05), 0]} color={i % 2 ? C.khaki : C.khaki2} />
      ))}
      <Box args={[0.03, 0.47, 0.52]} position={[-0.6, TOP + 0.23, -0.15]} color={C.margin} />
      {/* desk flag */}
      <Cyl r={0.015} h={0.55} position={[0.15, TOP + 0.28, -0.5]} color={C.ink} />
      <Cyl r={0.08} h={0.04} position={[0.15, TOP + 0.02, -0.5]} color={C.ink} />
      <Box args={[0.3, 0.06, 0.01]} position={[0.31, TOP + 0.5, -0.5]} color={C.saffron} />
      <Box args={[0.3, 0.06, 0.01]} position={[0.31, TOP + 0.44, -0.5]} color={C.sheet} />
      <Box args={[0.3, 0.06, 0.01]} position={[0.31, TOP + 0.38, -0.5]} color={C.leaf} />
      {/* landline (the politician is calling) */}
      <group position={[0.45, TOP, 0.2]} rotation={[0, -0.4, 0]}>
        <Box args={[0.4, 0.1, 0.32]} position={[0, 0.05, 0]} color={C.ink} />
        <Box args={[0.44, 0.06, 0.1]} position={[0, 0.14, -0.05]} color={C.ink} />
        <Box args={[0.16, 0.01, 0.12]} position={[0, 0.105, 0.08]} color={C.sheet} />
      </group>
    </group>
  );
}

function CreatorProps() {
  return (
    <group>
      {/* tripod + phone */}
      <group position={[-0.25, TOP, -0.15]}>
        {[0, 1, 2].map((i) => (
          <Cyl key={i} r={0.012} h={0.5} position={[Math.sin((i * Math.PI * 2) / 3) * 0.1, 0.24, Math.cos((i * Math.PI * 2) / 3) * 0.1]} rotation={[Math.cos((i * Math.PI * 2) / 3) * 0.25, 0, -Math.sin((i * Math.PI * 2) / 3) * 0.25]} color={C.ink} />
        ))}
        <Box args={[0.26, 0.48, 0.03]} position={[0, 0.74, 0]} color={C.ink} />
        <Box args={[0.22, 0.42, 0.01]} position={[0, 0.74, 0.02]} color={C.sky} />
        <Cyl r={0.025} h={0.01} position={[0.06, 0.9, 0.03]} rotation={[Math.PI / 2, 0, 0]} color={C.margin} />
        {/* ring light */}
        <mesh position={[0, 0.74, -0.06]}>
          <torusGeometry args={[0.36, 0.035, 6, 24]} />
          <M color={C.sheet} emissive={0.6} />
        </mesh>
      </group>
      {/* mic */}
      <group position={[0.45, TOP, 0.25]}>
        <Cyl r={0.08} h={0.03} position={[0, 0.015, 0]} color={C.ink} />
        <Cyl r={0.015} h={0.25} position={[0, 0.14, 0]} color={C.ink} />
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.07, 8, 6]} />
          <M color={C.steel} />
        </mesh>
      </group>
    </group>
  );
}

const PROPS: Record<AvatarId, () => React.ReactElement> = {
  engineer: EngineerProps,
  doctor: DoctorProps,
  ca: CaProps,
  officer: OfficerProps,
  creator: CreatorProps,
};

export default function DeskScene({ career, active }: { career: AvatarId; active: boolean }) {
  const Props = PROPS[career];
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.6]}
      camera={{ position: [1.9, 2.55, 3.55], fov: 36 }}
      gl={{ antialias: true, preserveDrawingBuffer: false }}
      onCreated={({ camera }) => camera.lookAt(0, 0.62, 0)}
      aria-hidden
    >
      <color attach="background" args={["#f3ecdd"]} />
      <hemisphereLight args={["#fff7e8", "#c9a46a", 1.1]} />
      <directionalLight position={[3, 6, 3]} intensity={1.8} />
      <PresentationControls global={false} cursor snap polar={[-0.15, 0.25]} azimuth={[-0.6, 0.6]} speed={1.4}>
        <group position={[0, -0.35, 0]}>
          <Desk />
          <ChaiGlass />
          <TiffinProp />
          <PopIn key={career}>
            <Props />
          </PopIn>
        </group>
      </PresentationControls>
      <ContactShadows position={[0, -0.41, 0]} opacity={0.35} scale={8} blur={2.2} far={2} resolution={256} color="#1e1a15" frames={1} />
    </Canvas>
  );
}

'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ZINC = '#3f3f46';
const ZINC_DIM = '#27272a';
const ACCENT = '#34d399';

/** Wireframe GPU card: PCB + memory fins + fan ring */
function GpuCard({
  position,
  accent = false,
}: {
  position: [number, number, number];
  accent?: boolean;
}) {
  const edge = accent ? ACCENT : ZINC;
  const box = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.5, 0.12, 0.95)),
    []
  );
  const finGeo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(0.06, 0.2, 0.9)),
    []
  );
  const fan = useMemo(() => new THREE.EdgesGeometry(new THREE.TorusGeometry(0.22, 0.02, 8, 24)), []);

  const fins = useMemo(() => [-0.55, -0.33, -0.11, 0.11, 0.33, 0.55], []);

  return (
    <group position={position}>
      <lineSegments geometry={box}>
        <lineBasicMaterial color={edge} transparent opacity={accent ? 0.9 : 0.7} />
      </lineSegments>
      {/* memory fins */}
      {fins.map((x) => (
        <lineSegments key={x} geometry={finGeo} position={[x, 0.16, 0]}>
          <lineBasicMaterial color={ZINC_DIM} transparent opacity={0.6} />
        </lineSegments>
      ))}
      {/* fan ring */}
      <lineSegments geometry={fan} position={[0.5, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <lineBasicMaterial color={accent ? ACCENT : ZINC} transparent opacity={0.8} />
      </lineSegments>
      {accent && (
        <mesh position={[0.5, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.012, 8, 24]} />
          <meshBasicMaterial color={ACCENT} transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}

/** A pulse traveling along a segment from `from` to `to` */
function DataPulse({
  from,
  to,
  offset,
}: {
  from: [number, number, number];
  to: [number, number, number];
  offset: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const a = useMemo(() => new THREE.Vector3(...from), [from]);
  const b = useMemo(() => new THREE.Vector3(...to), [to]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.elapsedTime * 0.35 + offset) % 1;
    ref.current.position.lerpVectors(a, b, t);
    const s = Math.sin(t * Math.PI);
    ref.current.scale.setScalar(0.02 + s * 0.03);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={ACCENT} transparent opacity={0.9} />
    </mesh>
  );
}

function Cluster() {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  // 2x2 card layout
  const cards = useMemo(
    () =>
      [
        { p: [-1.35, 0.9, 0] as [number, number, number], accent: false },
        { p: [1.35, 0.9, 0] as [number, number, number], accent: false },
        { p: [-1.35, -0.9, 0] as [number, number, number], accent: true },
        { p: [1.35, -0.9, 0] as [number, number, number], accent: true },
      ],
    []
  );
  const hub: [number, number, number] = [0, 0, 0];

  const lines = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pts: number[] = [];
    cards.forEach(({ p }) => {
      pts.push(p[0], p[1], p[2], hub[0], hub[1], hub[2]);
    });
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, [cards]);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    // slow idle rotation + gentle float
    group.current.rotation.y = Math.sin(t * 0.12) * 0.25 + pointer.x * 0.35;
    group.current.rotation.x = -0.35 + Math.cos(t * 0.1) * 0.05 - pointer.y * 0.2;
    group.current.position.y = Math.sin(t * 0.5) * 0.06;
    target.current.x = pointer.x;
    target.current.y = pointer.y;
  });

  return (
    <group ref={group} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      {/* bus lines to hub */}
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={ZINC} transparent opacity={0.35} />
      </lineSegments>
      {/* hub node */}
      <mesh>
        <icosahedronGeometry args={[0.16, 1]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.6} />
      </mesh>
      {/* cards */}
      {cards.map(({ p, accent }, i) => (
        <GpuCard key={i} position={p} accent={accent} />
      ))}
      {/* data pulses */}
      {cards.map(({ p }, i) => (
        <DataPulse key={i} from={p} to={hub} offset={i * 0.25} />
      ))}
    </group>
  );
}

export function GpuClusterScene() {
  return (
    <div className="pointer-events-auto h-full w-full" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.4, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Cluster />
      </Canvas>
    </div>
  );
}

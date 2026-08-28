'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ZINC = '#3f3f46';
const ZINC_DIM = '#27272a';
const ACCENT = '#34d399';
const HUB: [number, number, number] = [0, 0, 0];

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

interface DragState {
  dragging: boolean;
  lastX: number;
  lastY: number;
  rotX: number;
  rotY: number;
  velX: number;
  velY: number;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

function Cluster({
  drag,
  reducedMotion,
}: {
  drag: React.MutableRefObject<DragState>;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);

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
  const lines = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pts: number[] = [];
    cards.forEach(({ p }) => {
      pts.push(p[0], p[1], p[2], HUB[0], HUB[1], HUB[2]);
    });
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, [cards]);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    const d = drag.current;

    // inertia after release
    if (!d.dragging) {
      d.rotX += d.velX;
      d.rotY += d.velY;
      d.velX *= 0.95;
      d.velY *= 0.95;
      d.rotX = Math.max(-0.9, Math.min(0.9, d.rotX));
    }

    // slow idle rotation + gentle float; parallax only when not dragging.
    // With reduced motion: static pose, no idle drift — drag still works.
    if (reducedMotion) {
      group.current.rotation.y = d.rotY;
      group.current.rotation.x = -0.35 + d.rotX;
      group.current.position.y = 0;
      return;
    }

    const parallax = d.dragging ? 0 : 1;
    group.current.rotation.y =
      Math.sin(t * 0.12) * 0.25 * parallax + pointer.x * 0.35 * parallax + d.rotY;
    group.current.rotation.x =
      -0.35 + Math.cos(t * 0.1) * 0.05 * parallax - pointer.y * 0.2 * parallax + d.rotX;
    group.current.position.y = Math.sin(t * 0.5) * 0.06;
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
      {/* data pulses (omitted under reduced motion) */}
      {!reducedMotion &&
        cards.map(({ p }, i) => (
          <DataPulse key={i} from={p} to={HUB} offset={i * 0.25} />
        ))}
    </group>
  );
}

export function GpuClusterScene() {
  const drag = useRef<DragState>({
    dragging: false,
    lastX: 0,
    lastY: 0,
    rotX: 0,
    rotY: 0,
    velX: 0,
    velY: 0,
  });

  const reducedMotion = usePrefersReducedMotion();

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    d.dragging = true;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.velX = 0;
    d.velY = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.dragging) return;
    const dx = e.clientX - d.lastX;
    const dy = e.clientY - d.lastY;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.rotY += dx * 0.006;
    d.rotX = Math.max(-0.9, Math.min(0.9, d.rotX + dy * 0.006));
    d.velY = dx * 0.0054;
    d.velX = dy * 0.0054;
  };

  const endDrag = () => {
    drag.current.dragging = false;
  };

  return (
    <div
      className="pointer-events-auto h-full w-full cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.4, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Cluster drag={drag} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

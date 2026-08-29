'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ZINC = '#3f3f46';
const ZINC_DIM = '#27272a';

type V3 = [number, number, number];
type VariantId = 'topology' | 'constellation' | 'orbits' | 'field';
const VARIANTS: VariantId[] = ['topology', 'constellation', 'orbits', 'field'];

/** Per-variant accent so each visit feels different. */
const ACCENTS: Record<VariantId, { hex: string; rgb: [number, number, number] }> = {
  topology: { hex: '#34d399', rgb: [52, 211, 153] },
  constellation: { hex: '#a78bfa', rgb: [167, 139, 250] },
  orbits: { hex: '#22d3ee', rgb: [34, 211, 238] },
  field: { hex: '#fbbf24', rgb: [251, 191, 36] },
};

/** Deterministic PRNG — one seed per page load drives every random choice. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeGlowTexture(rgb: [number, number, number]) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const [r, g, b] = rgb;
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, `rgba(${r},${g},${b},0.85)`);
  grad.addColorStop(0.35, `rgba(${r},${g},${b},0.25)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

/** Soft additive glow billboard. */
function Glow({
  position,
  rgb,
  size = 1.2,
  opacity = 0.5,
}: {
  position: V3;
  rgb: [number, number, number];
  size?: number;
  opacity?: number;
}) {
  const texture = useMemo(() => makeGlowTexture(rgb), [rgb]);
  return (
    <sprite position={position} scale={[size, size, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
}

/** Distant slow-rotating dust for depth. */
function Starfield({ rng }: { rng: () => number }) {
  const geometry = useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 6 + rng() * 5;
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [rng]);

  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.006;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color="#4b4b55" size={0.02} sizeAttenuation transparent opacity={0.55} />
    </points>
  );
}

/** A pulse traveling along a straight segment from `from` to `to`. */
function DataPulse({
  from,
  to,
  offset,
  color,
  speed = 0.35,
}: {
  from: V3;
  to: V3;
  offset: number;
  color: string;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const a = useMemo(() => new THREE.Vector3(...from), [from]);
  const b = useMemo(() => new THREE.Vector3(...to), [to]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.elapsedTime * speed + offset) % 1;
    ref.current.position.lerpVectors(a, b, t);
    const s = Math.sin(t * Math.PI);
    ref.current.scale.setScalar(0.018 + s * 0.028);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

/** Wireframe GPU card: PCB + memory fins + fan ring. */
function GpuCard({
  position,
  accentColor,
}: {
  position: V3;
  accentColor?: string;
}) {
  const edge = accentColor ?? ZINC;
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
        <lineBasicMaterial color={edge} transparent opacity={accentColor ? 0.9 : 0.7} />
      </lineSegments>
      {/* memory fins */}
      {fins.map((x) => (
        <lineSegments key={x} geometry={finGeo} position={[x, 0.16, 0]}>
          <lineBasicMaterial color={ZINC_DIM} transparent opacity={0.6} />
        </lineSegments>
      ))}
      {/* fan ring */}
      <lineSegments geometry={fan} position={[0.5, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <lineBasicMaterial color={edge} transparent opacity={0.8} />
      </lineSegments>
      {accentColor && (
        <mesh position={[0.5, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.012, 8, 24]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}

/** Giant ghosted name in 3D space behind the cluster. Identical in every variant. */
function NameBackdrop() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2000;
    canvas.height = 400;
    const ctx = canvas.getContext('2d')!;
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;

    // Resolve the self-hosted Inter family (next/font hashes the name).
    let family = 'Inter, system-ui, sans-serif';
    try {
      const probe = document.createElement('span');
      probe.style.fontFamily = 'var(--font-inter)';
      probe.style.display = 'none';
      document.body.appendChild(probe);
      const resolved = getComputedStyle(probe).fontFamily;
      if (resolved) family = resolved;
      document.body.removeChild(probe);
    } catch {
      /* keep fallback stack */
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `500 220px ${family}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '10px';
      ctx.fillStyle = '#fafafa';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Logan Phillips', canvas.width / 2, canvas.height / 2);
      tex.needsUpdate = true;
    };

    draw();
    // Redraw once webfonts are ready (the first draw may use the fallback).
    if (document.fonts?.ready) document.fonts.ready.then(draw);
    return tex;
  }, []);

  return (
    <mesh position={[0, 0, -1.7]}>
      <planeGeometry args={[6.4, 1.28]} />
      <meshBasicMaterial map={texture} transparent opacity={0.09} depthWrite={false} />
    </mesh>
  );
}

function useLineGeometry(segments: V3[][]) {
  return useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pts: number[] = [];
    for (const [a, b] of segments) pts.push(...a, ...b);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, [segments]);
}

interface SceneProps {
  rng: () => number;
  reducedMotion: boolean;
  accent: { hex: string; rgb: [number, number, number] };
}

/* ── Variant 1: classic 2×2 topology with a glowing hub ─────────── */
function TopologyScene({ reducedMotion, accent }: SceneProps) {
  const HUB: V3 = [0, 0, 0];
  const cards = useMemo(
    () =>
      [
        { p: [-1.35, 0.9, 0] as V3, accent: false },
        { p: [1.35, 0.9, 0] as V3, accent: false },
        { p: [-1.35, -0.9, 0] as V3, accent: true },
        { p: [1.35, -0.9, 0] as V3, accent: true },
      ],
    []
  );
  const lines = useLineGeometry(cards.map(({ p }) => [p, HUB]));

  return (
    <group>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={ZINC} transparent opacity={0.35} />
      </lineSegments>
      {/* hub */}
      <mesh>
        <icosahedronGeometry args={[0.16, 1]} />
        <meshBasicMaterial color={accent.hex} wireframe transparent opacity={0.6} />
      </mesh>
      <Glow position={HUB} rgb={accent.rgb} size={1.6} opacity={0.5} />
      {cards.map(({ p, accent: isAccent }, i) => (
        <group key={i}>
          <GpuCard position={p} accentColor={isAccent ? accent.hex : undefined} />
          {isAccent && <Glow position={[p[0] + 0.5, p[1] + 0.08, p[2]]} rgb={accent.rgb} size={0.7} opacity={0.35} />}
        </group>
      ))}
      {!reducedMotion &&
        cards.map(({ p }, i) => (
          <DataPulse key={i} from={p} to={HUB} offset={i * 0.25} color={accent.hex} />
        ))}
    </group>
  );
}

/* ── Variant 2: randomized chip constellation ───────────────────── */
function ConstellationScene({ rng, reducedMotion, accent }: SceneProps) {
  const data = useMemo(() => {
    const count = 11;
    const nodes: { p: V3; chip: boolean }[] = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        p: [
          (rng() - 0.5) * 3.2,
          (rng() - 0.5) * 2.0,
          (rng() - 0.5) * 1.6,
        ],
        chip: i < 3,
      });
    }
    const edges: V3[][] = [];
    const seen = (a: number, b: number) =>
      edges.some(([x, y]) => (x === nodes[a].p && y === nodes[b].p) || (x === nodes[b].p && y === nodes[a].p));
    // spanning tree keeps the graph connected
    for (let i = 1; i < count; i++) {
      const j = Math.floor(rng() * i);
      edges.push([nodes[i].p, nodes[j].p]);
    }
    // plus a few nearest-neighbor links
    for (let i = 0; i < count; i++) {
      const nearest = nodes
        .map((n, k) => ({ k, d: Math.hypot(n.p[0] - nodes[i].p[0], n.p[1] - nodes[i].p[1], n.p[2] - nodes[i].p[2]) }))
        .filter((e) => e.k !== i)
        .sort((a, b) => a.d - b.d)[0];
      if (nearest && rng() < 0.6 && !seen(i, nearest.k)) edges.push([nodes[i].p, nodes[nearest.k].p]);
    }
    // pulses ride six random edges
    const pulseEdges = Array.from({ length: 6 }, () => edges[Math.floor(rng() * edges.length)]);
    return { nodes, edges, pulseEdges };
  }, [rng]);

  const lines = useLineGeometry(data.edges);

  return (
    <group>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={ZINC} transparent opacity={0.3} />
      </lineSegments>
      {data.nodes.map(({ p, chip }, i) =>
        chip ? (
          <group key={i}>
            <GpuCard position={p} accentColor={accent.hex} />
            <Glow position={p} rgb={accent.rgb} size={1.1} opacity={0.4} />
          </group>
        ) : (
          <group key={i}>
            <mesh position={p}>
              <octahedronGeometry args={[0.07, 0]} />
              <meshBasicMaterial color={ZINC} wireframe transparent opacity={0.8} />
            </mesh>
            <Glow position={p} rgb={accent.rgb} size={0.35} opacity={0.3} />
          </group>
        )
      )}
      {!reducedMotion &&
        data.pulseEdges.map(([from, to], i) => (
          <DataPulse key={i} from={from} to={to} offset={(i * 0.37) % 1} color={accent.hex} speed={0.3 + (i % 3) * 0.08} />
        ))}
    </group>
  );
}

/* ── Variant 3: orbital rings around a core ─────────────────────── */
function OrbitsScene({ rng, reducedMotion, accent }: SceneProps) {
  const rings = useMemo(
    () =>
      [0.85, 1.35, 1.85].map((radius, i) => ({
        radius,
        tiltX: (rng() - 0.5) * 0.9,
        tiltZ: (rng() - 0.5) * 0.9,
        speed: (0.12 + rng() * 0.18) * (i % 2 === 0 ? 1 : -1),
        nodeAngles: Array.from({ length: 3 + Math.floor(rng() * 3) }, () => rng() * Math.PI * 2),
        pulseOffset: rng(),
      })),
    [rng]
  );

  const ringGeos = useMemo(
    () =>
      rings.map(({ radius }) => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i < 64; i++) {
          const a = (i / 64) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
        }
        return new THREE.BufferGeometry().setFromPoints(pts);
      }),
    [rings]
  );

  const ringRefs = useRef<(THREE.Group | null)[]>([]);
  const pulseRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    rings.forEach((ring, i) => {
      const g = ringRefs.current[i];
      if (g) g.rotation.y = clock.elapsedTime * ring.speed;
      const p = pulseRefs.current[i];
      if (p) {
        const a = clock.elapsedTime * ring.speed * 2.2 + ring.pulseOffset * Math.PI * 2;
        p.position.set(Math.cos(a) * ring.radius, 0, Math.sin(a) * ring.radius);
      }
    });
  });

  return (
    <group>
      {/* core */}
      <mesh>
        <icosahedronGeometry args={[0.22, 1]} />
        <meshBasicMaterial color={accent.hex} wireframe transparent opacity={0.6} />
      </mesh>
      <Glow position={[0, 0, 0]} rgb={accent.rgb} size={2.2} opacity={0.45} />
      {rings.map((ring, i) => (
        <group key={i} rotation={[ring.tiltX, 0, ring.tiltZ]}>
          <group
            ref={(el) => {
              ringRefs.current[i] = el;
            }}
          >
            <lineLoop geometry={ringGeos[i]}>
              <lineBasicMaterial color={ZINC} transparent opacity={0.4} />
            </lineLoop>
            {ring.nodeAngles.map((a, j) => (
              <group key={j}>
                <GpuCard
                  position={[Math.cos(a) * ring.radius, 0, Math.sin(a) * ring.radius]}
                  accentColor={j === 0 ? accent.hex : undefined}
                />
              </group>
            ))}
            <mesh
              ref={(el) => {
                pulseRefs.current[i] = el;
              }}
            >
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshBasicMaterial color={accent.hex} transparent opacity={0.9} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

/* ── Variant 4: drifting compute field ──────────────────────────── */
function FieldScene({ rng, reducedMotion, accent }: SceneProps) {
  const data = useMemo(() => {
    const count = 240;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = rng() * Math.PI * 2;
      const r = Math.sqrt(rng()) * 2.3;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (rng() - 0.5) * 1.7;
      pos[i * 3 + 2] = Math.sin(a) * r * 0.6;
    }
    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const cards: V3[] = Array.from({ length: 3 }, () => [
      (rng() - 0.5) * 3.4,
      (rng() - 0.5) * 1.8,
      (rng() - 0.5) * 1.0,
    ]);
    return { pointsGeo, cards };
  }, [rng]);

  const lines = useLineGeometry(
    data.cards.map((p, i) => [p, data.cards[(i + 1) % data.cards.length]])
  );

  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (ref.current && !reducedMotion) ref.current.rotation.y = clock.elapsedTime * 0.04;
  });

  return (
    <group>
      <points ref={ref} geometry={data.pointsGeo}>
        <pointsMaterial color="#6b6b76" size={0.025} sizeAttenuation transparent opacity={0.6} />
      </points>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={ZINC} transparent opacity={0.3} />
      </lineSegments>
      {data.cards.map((p, i) => (
        <group key={i}>
          <GpuCard position={p} accentColor={i === 1 ? accent.hex : undefined} />
          <Glow position={p} rgb={accent.rgb} size={0.9} opacity={i === 1 ? 0.45 : 0.25} />
        </group>
      ))}
      {!reducedMotion &&
        data.cards.map((p, i) => (
          <DataPulse
            key={i}
            from={p}
            to={data.cards[(i + 1) % data.cards.length]}
            offset={i * 0.33}
            color={accent.hex}
          />
        ))}
    </group>
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
  variant,
  rng,
}: {
  drag: React.MutableRefObject<DragState>;
  reducedMotion: boolean;
  variant: VariantId;
  rng: () => number;
}) {
  const group = useRef<THREE.Group>(null);
  const accent = ACCENTS[variant];

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
      {/* ghosted name in the background — identical in every variant */}
      <NameBackdrop />
      {variant === 'topology' && <TopologyScene rng={rng} reducedMotion={reducedMotion} accent={accent} />}
      {variant === 'constellation' && <ConstellationScene rng={rng} reducedMotion={reducedMotion} accent={accent} />}
      {variant === 'orbits' && <OrbitsScene rng={rng} reducedMotion={reducedMotion} accent={accent} />}
      {variant === 'field' && <FieldScene rng={rng} reducedMotion={reducedMotion} accent={accent} />}
    </group>
  );
}

export function GpuClusterScene() {
  // One random seed per page load → a different scene every refresh,
  // stable for the lifetime of the page (and consistent under strict mode).
  const [config] = useState(() => {
    const seed = Math.floor(Math.random() * 0x7fffffff);
    const variant = VARIANTS[seed % VARIANTS.length];
    return { variant, rng: mulberry32(seed) };
  });

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
        <Starfield rng={config.rng} />
        <Cluster drag={drag} reducedMotion={reducedMotion} variant={config.variant} rng={config.rng} />
      </Canvas>
    </div>
  );
}

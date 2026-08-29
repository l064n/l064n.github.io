'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ────────────────────────────────────────────────────────────────────
 * Living constellation — a spring-held particle system that morphs
 * between structured shapes (sphere, helix, torus knot, spiral galaxy,
 * wave field, cube, nebula clusters), with distance-based links,
 * additive glow, twinkling stars, nebula backdrops, and comets.
 * A different shape + palette is chosen on every page load.
 * ──────────────────────────────────────────────────────────────────── */

export interface ClusterTelemetry {
  shape: string;
  palette: string;
  fps: number;
  particles: number;
}

const COUNT = 170;
const STARS = 300;
const R = 2.0; // shape radius (world units)
const LINK_DIST = 0.62;
const MAX_LINKS = 1400;
const SPRING = 0.0045;
const DAMP = 0.94;
const MAX_SPEED = 0.05;
const DRIFT = 0.00004;
const MORPH_PERIOD = 14; // seconds
const PALETTE_PERIOD = 28; // seconds
const GOLDEN = 2.399963229728653;

type Rng = () => number;

function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Cheap deterministic hash (matches the reference's sin hash). */
function hash(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = (((h % 360) + 360) % 360) / 360;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)];
}

function fibDir(i: number, n: number) {
  const y = 1 - (i / (n - 1)) * 2;
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const th = i * GOLDEN;
  return { x: Math.cos(th) * r, y, z: Math.sin(th) * r };
}

/* ── the seven shapes (ported from constellation-3d, R & time re-scaled) ── */

type ShapeFn = (i: number, n: number, t: number, out: THREE.Vector3) => void;

const shapeSphere: ShapeFn = (i, n, t, out) => {
  const yy = 1 - (i / (n - 1)) * 2;
  const rr = Math.sqrt(Math.max(0, 1 - yy * yy));
  const th = GOLDEN * i + t * 0.4;
  const r = R * (0.92 + 0.06 * Math.sin(t * 0.8 + i * 0.7));
  out.set(Math.cos(th) * rr * r, yy * r, Math.sin(th) * rr * r);
};

const shapeHelix: ShapeFn = (i, n, t, out) => {
  const strand = i % 2;
  const f = i / n;
  const ang = f * Math.PI * 5 + t * 0.6 + strand * Math.PI;
  const rad = R * 0.42 + 0.09 * Math.sin(f * 24 + t * 2.0);
  out.set(Math.cos(ang) * rad, (f - 0.5) * R * 2.2, Math.sin(ang) * rad);
};

const shapeTorusKnot: ShapeFn = (i, n, t, out) => {
  const p = 2;
  const q = 3;
  const u = (i / n) * Math.PI * 2 + t * 0.45;
  const rr = Math.cos(q * u) + 2;
  const s = R * 0.42;
  out.set(rr * Math.cos(p * u) * s, Math.sin(q * u) * s, rr * Math.sin(p * u) * s);
};

const shapeGalaxy: ShapeFn = (i, n, t, out) => {
  const arms = 3;
  const arm = i % arms;
  const m = Math.floor(i / arms);
  const mm = Math.ceil(n / arms);
  const f = m / mm;
  const spread = (hash(i) - 0.5) * 0.5 * (1 - f);
  const ang = arm * ((Math.PI * 2) / arms) + f * Math.PI * 2.6 + t * 0.25 + spread;
  const rad = R * (0.12 + 0.88 * Math.pow(f, 0.65)) * (0.88 + 0.24 * hash(i + 99));
  const thick = 0.2 * (1 - f) + 0.05;
  out.set(Math.cos(ang) * rad, (hash(i + 7) - 0.5) * 2 * thick, Math.sin(ang) * rad);
};

const shapeWave: ShapeFn = (i, n, t, out) => {
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const gx = i % cols;
  const gy = Math.floor(i / cols);
  const x = (gx / (cols - 1) - 0.5) * R * 2;
  const z = (gy / Math.max(1, rows - 1) - 0.5) * R * 2;
  out.set(x, 0.55 * Math.sin(x * 1.65 + t * 1.6) * Math.cos(z * 1.65 + t * 1.2), z);
};

const shapeCube: ShapeFn = (i, n, t, out) => {
  const h = R * 0.55;
  const face = i % 6;
  const u = (hash(i) - 0.5) * 2 * h;
  const v = (hash(i + 31) - 0.5) * 2 * h;
  let x: number;
  let y: number;
  let z: number;
  switch (face) {
    case 0: x = h; y = u; z = v; break;
    case 1: x = -h; y = u; z = v; break;
    case 2: x = u; y = h; z = v; break;
    case 3: x = u; y = -h; z = v; break;
    case 4: x = u; y = v; z = h; break;
    default: x = u; y = v; z = -h;
  }
  const rot = t * 0.3;
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  out.set(x * c + z * s, y, -x * s + z * c);
};

const shapeNebula: ShapeFn = (i, n, t, out) => {
  const C = 6;
  const c = i % C;
  const cf = Math.floor(i / C);
  const d = fibDir(c, C);
  const rot = t * 0.3;
  const cr = Math.cos(rot);
  const sr = Math.sin(rot);
  const bx = (d.x * cr + d.z * sr) * R * 0.55;
  const bz = (-d.x * sr + d.z * cr) * R * 0.55;
  const by = d.y * R * 0.5;
  const rad = R * (0.14 + 0.1 * hash(c * 17.3));
  const rr = rad * Math.cbrt(hash(cf * 7.13 + c * 91.7));
  const th = hash(cf * 3.7 + c * 57.1) * 6.2832 + t * 0.9;
  const ph = Math.acos(2 * hash(cf * 9.7 + c * 13.9) - 1);
  out.set(
    bx + rr * Math.sin(ph) * Math.cos(th),
    by + rr * Math.cos(ph),
    bz + rr * Math.sin(ph) * Math.sin(th)
  );
};

const SHAPES: { name: string; fn: ShapeFn }[] = [
  { name: 'SPHERE', fn: shapeSphere },
  { name: 'DOUBLE HELIX', fn: shapeHelix },
  { name: 'TORUS KNOT', fn: shapeTorusKnot },
  { name: 'SPIRAL GALAXY', fn: shapeGalaxy },
  { name: 'WAVE FIELD', fn: shapeWave },
  { name: 'CUBE', fn: shapeCube },
  { name: 'NEBULA CLUSTERS', fn: shapeNebula },
];

const PALETTES: { name: string; hues: [number, number, number] }[] = [
  { name: 'AURORA', hues: [160, 200, 275] },
  { name: 'NEBULA', hues: [285, 320, 215] },
  { name: 'EMBER', hues: [8, 32, 55] },
  { name: 'GLACIER', hues: [195, 215, 240] },
];

/* ── shaders ── */

const HSL2RGB_GLSL = /* glsl */ `
vec3 hsl2rgb(vec3 hsl) {
  vec3 rgb = clamp(abs(mod(hsl.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0 * hsl.z - 1.0));
}
`;

const particleVert = /* glsl */ `
attribute float aRadius;
attribute float aPhase;
attribute float aHueSlot;
attribute float aHueJitter;
uniform float uTime;
uniform float uHueA0;
uniform float uHueA1;
uniform float uHueA2;
uniform float uHueB0;
uniform float uHueB1;
uniform float uHueB2;
uniform float uBlend;
uniform float uPixelScale;
varying float vHue;
varying float vTwinkle;
varying float vDepth;
void main() {
  float slot = floor(aHueSlot + 0.5);
  float hA = (slot < 0.5) ? uHueA0 : (slot < 1.5 ? uHueA1 : uHueA2);
  float hB = (slot < 0.5) ? uHueB0 : (slot < 1.5 ? uHueB1 : uHueB2);
  vHue = hA + (hB - hA) * uBlend + aHueJitter;
  vTwinkle = 0.55 + 0.45 * sin(uTime * 1.8 + aPhase);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDepth = clamp(1.0 - (-mv.z - 3.5) / 7.0, 0.15, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aRadius * uPixelScale / max(0.1, -mv.z);
}
`;

const particleFrag = /* glsl */ `
precision mediump float;
uniform float uTime;
varying float vHue;
varying float vTwinkle;
varying float vDepth;
${HSL2RGB_GLSL}
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  if (d > 1.0) discard;
  float glow = smoothstep(1.0, 0.0, d);
  float core = smoothstep(0.55, 0.0, d);
  vec3 col = hsl2rgb(vec3(vHue / 360.0, 0.9, 0.56 + 0.24 * vDepth));
  float a = (glow * 0.30 + core * 0.85) * vTwinkle * vDepth;
  gl_FragColor = vec4(col, a);
}
`;

const starVert = /* glsl */ `
attribute float aSize;
attribute float aPhase;
uniform float uPixelScale;
uniform float uTime;
varying float vTwinkle;
void main() {
  vTwinkle = 0.6 + 0.4 * sin(uTime * 1.0 + aPhase);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  if (-mv.z < 1.0) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 0.0;
    return;
  }
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixelScale / -mv.z;
}
`;

const starFrag = /* glsl */ `
precision mediump float;
uniform vec3 uColor;
varying float vTwinkle;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  if (d > 1.0) discard;
  float a = smoothstep(1.0, 0.0, d) * vTwinkle * 0.5;
  gl_FragColor = vec4(uColor, a);
}
`;

/** Soft white radial-gradient sprite texture (tinted per-material). */
function useGlowTexture() {
  const { gl } = useThree();
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,255,255,0.9)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.28)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl]);
}

/* ── giant ghosted name in 3D space behind the cluster (identical every load) ── */
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
    <mesh position={[0, 0, -2.2]}>
      <planeGeometry args={[7.0, 1.4]} />
      <meshBasicMaterial map={texture} transparent opacity={0.08} depthWrite={false} />
    </mesh>
  );
}

/* ── the simulation + rendering core ── */

interface SimState {
  pos: Float32Array;
  vel: Float32Array;
  phase: Float32Array;
  hueSlot: Uint8Array;
  hueJitter: Float32Array;
  radius: Float32Array;
  depth: Float32Array;
  hue: Float32Array;
  t: number; // sim time (s), frozen under reduced motion
  shapeIdx: number;
  prevShapeIdx: number;
  morphT: number; // 0..1 blend between prev and current shape
  autoT: number; // seconds since last auto morph
  palIdx: number;
  palFrom: number;
  palBlend: number;
  palT: number;
  fps: number;
  fpsTimer: number;
  telTimer: number;
  staticPlaced: boolean;
}

function ConstellationCore({
  reducedMotion,
  seedShape,
  seedPalette,
  onTelemetry,
}: {
  reducedMotion: boolean;
  seedShape: number;
  seedPalette: number;
  onTelemetry?: (t: ClusterTelemetry) => void;
}) {
  const { gl, camera } = useThree();
  const glowTex = useGlowTexture();

  const sim = useRef<SimState | null>(null);
  if (!sim.current) {
    const rng = mulberry32(1234);
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // start scattered on a shell; springs pull them into the first shape
      const u = rng() * 2 - 1;
      const th = rng() * Math.PI * 2;
      const r = R * (1.6 + rng() * 1.1) * Math.sqrt(1 - u * u);
      pos[i * 3] = Math.cos(th) * r;
      pos[i * 3 + 1] = u * R * (1.6 + rng() * 1.1) * 0.7;
      pos[i * 3 + 2] = Math.sin(th) * r;
    }
    const phase = new Float32Array(COUNT);
    const hueSlot = new Uint8Array(COUNT);
    const hueJitter = new Float32Array(COUNT);
    const radius = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      phase[i] = rng() * Math.PI * 2;
      hueSlot[i] = i % 3;
      hueJitter[i] = (hash(i * 3.7) - 0.5) * 42;
      radius[i] = 0.018 + rng() * 0.028;
    }
    sim.current = {
      pos,
      vel: new Float32Array(COUNT * 3),
      phase,
      hueSlot,
      hueJitter,
      radius,
      depth: new Float32Array(COUNT),
      hue: new Float32Array(COUNT),
      t: 0,
      shapeIdx: seedShape % SHAPES.length,
      prevShapeIdx: seedShape % SHAPES.length,
      morphT: 1,
      autoT: 0,
      palIdx: seedPalette % PALETTES.length,
      palFrom: seedPalette % PALETTES.length,
      palBlend: 1,
      palT: 0,
      fps: 60,
      fpsTimer: 0,
      telTimer: 0,
      staticPlaced: false,
    };
  }

  // particle geometry
  const pGeo = useMemo(() => {
    const s = sim.current!;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(s.pos, 3));
    g.setAttribute('aRadius', new THREE.BufferAttribute(s.radius, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(s.phase, 1));
    g.setAttribute('aHueSlot', new THREE.BufferAttribute(s.hueSlot as unknown as Float32Array, 1));
    g.setAttribute('aHueJitter', new THREE.BufferAttribute(s.hueJitter, 1));
    return g;
  }, []);

  // link buffers (preallocated)
  const linkGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(MAX_LINKS * 6);
    const col = new Float32Array(MAX_LINKS * 6);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setDrawRange(0, 0);
    return g;
  }, []);

  // star geometry
  const starGeo = useMemo(() => {
    const rng = mulberry32(777);
    const pos = new Float32Array(STARS * 3);
    const size = new Float32Array(STARS);
    const ph = new Float32Array(STARS);
    for (let i = 0; i < STARS; i++) {
      const u = rng() * 2 - 1;
      const th = rng() * Math.PI * 2;
      const r = 9 + rng() * 4;
      const rr = r * Math.sqrt(1 - u * u);
      pos[i * 3] = Math.cos(th) * rr;
      pos[i * 3 + 1] = u * r * 0.8;
      pos[i * 3 + 2] = Math.sin(th) * rr;
      size[i] = 0.008 + rng() * 0.014;
      ph[i] = rng() * Math.PI * 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));
    return g;
  }, []);

  // morph shockwave rings
  const ringGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);
  const rings = useRef<{ r: number; life: number }[]>([]);
  const ringRefs = useRef<(THREE.LineLoop | null)[]>([]);

  // comet
  const comet = useRef<{
    p: THREE.Vector3;
    v: THREE.Vector3;
    life: number;
    active: boolean;
    next: number;
  }>({ p: new THREE.Vector3(), v: new THREE.Vector3(), life: 0, active: false, next: 5 });
  const cometTrailGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHueA0: { value: 160 },
      uHueA1: { value: 200 },
      uHueA2: { value: 275 },
      uHueB0: { value: 160 },
      uHueB1: { value: 200 },
      uHueB2: { value: 275 },
      uBlend: { value: 1 },
      uPixelScale: { value: 800 },
    }),
    []
  );
  const starUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelScale: { value: 800 },
      uColor: { value: new THREE.Color(0.8, 0.85, 0.95) },
    }),
    []
  );

  // dispose GPU resources on unmount
  useEffect(() => {
    return () => {
      pGeo.dispose();
      linkGeo.dispose();
      starGeo.dispose();
      ringGeo.dispose();
      cometTrailGeo.dispose();
      glowTex.dispose();
    };
  }, [pGeo, linkGeo, starGeo, ringGeo, cometTrailGeo, glowTex]);

  const target = useMemo(() => new THREE.Vector3(), []);
  const prevTarget = useMemo(() => new THREE.Vector3(), []);
  const colA = useMemo(() => new THREE.Color(), []);
  const colB = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const s = sim.current!;
    const dtF = Math.min(delta / 0.016667, 3);
    const dtS = Math.min(delta, 0.05);
    const cam = camera as THREE.PerspectiveCamera;
    const pixelScale =
      gl.domElement.height / (2 * Math.tan(THREE.MathUtils.degToRad(cam.fov * 0.5)));
    uniforms.uPixelScale.value = pixelScale;
    starUniforms.uPixelScale.value = pixelScale;

    const palA = PALETTES[s.palFrom].hues;
    const palB = PALETTES[s.palIdx].hues;
    uniforms.uHueA0.value = palA[0];
    uniforms.uHueA1.value = palA[1];
    uniforms.uHueA2.value = palA[2];
    uniforms.uHueB0.value = palB[0];
    uniforms.uHueB1.value = palB[1];
    uniforms.uHueB2.value = palB[2];
    uniforms.uBlend.value = s.palBlend;

    if (!reducedMotion) {
      s.t += dtS;

      // palette cycle
      if (s.palBlend < 1) s.palBlend = Math.min(1, s.palBlend + dtF * 0.02);
      s.palT += dtF;
      if (s.palT > PALETTE_PERIOD * 60) {
        s.palFrom = s.palIdx;
        s.palIdx = (s.palIdx + 1) % PALETTES.length;
        s.palBlend = 0;
        s.palT = 0;
      }

      // auto shape morph
      s.autoT += dtS;
      if (s.autoT > MORPH_PERIOD) {
        s.prevShapeIdx = s.shapeIdx;
        let next = s.shapeIdx + 1 + Math.floor(Math.random() * (SHAPES.length - 1));
        next %= SHAPES.length;
        s.shapeIdx = next;
        s.autoT = 0;
        s.morphT = 0;
        // burst outward
        for (let i = 0; i < COUNT; i++) {
          const x = s.pos[i * 3];
          const y = s.pos[i * 3 + 1];
          const z = s.pos[i * 3 + 2];
          const d = Math.hypot(x, y, z) || 1;
          const f = 0.008 * (0.35 + 0.65 * hash(i * 131));
          s.vel[i * 3] += (x / d) * f;
          s.vel[i * 3 + 1] += (y / d) * f;
          s.vel[i * 3 + 2] += (z / d) * f;
        }
        rings.current = [0, 1, 2].map((k) => ({ r: -k * 0.35, life: 1.25 }));
      }
      if (s.morphT < 1) s.morphT = Math.min(1, s.morphT + dtF / 72);

      // physics
      const shapeCur = SHAPES[s.shapeIdx].fn;
      const shapePrev = SHAPES[s.prevShapeIdx].fn;
      const morphing = s.morphT < 1 && s.prevShapeIdx !== s.shapeIdx;
      const damp = Math.pow(DAMP, dtF);
      for (let i = 0; i < COUNT; i++) {
        shapeCur(i, COUNT, s.t, target);
        let tx = target.x;
        let ty = target.y;
        let tz = target.z;
        if (morphing) {
          const e = s.morphT * s.morphT * (3 - 2 * s.morphT); // smoothstep
          shapePrev(i, COUNT, s.t, prevTarget);
          tx = prevTarget.x + (tx - prevTarget.x) * e;
          ty = prevTarget.y + (ty - prevTarget.y) * e;
          tz = prevTarget.z + (tz - prevTarget.z) * e;
        }
        const ix = i * 3;
        s.vel[ix] += (tx - s.pos[ix]) * SPRING * dtF;
        s.vel[ix + 1] += (ty - s.pos[ix + 1]) * SPRING * dtF;
        s.vel[ix + 2] += (tz - s.pos[ix + 2]) * SPRING * dtF;
        // organic micro-drift
        s.vel[ix] += Math.sin(s.t * 1.1 + s.phase[i] * 5.1) * DRIFT * dtF;
        s.vel[ix + 1] += Math.cos(s.t * 0.9 + s.phase[i] * 3.7) * DRIFT * dtF;
        s.vel[ix + 2] += Math.sin(s.t * 1.3 + s.phase[i] * 2.3) * DRIFT * dtF;
        s.vel[ix] *= damp;
        s.vel[ix + 1] *= damp;
        s.vel[ix + 2] *= damp;
        const sp = Math.hypot(s.vel[ix], s.vel[ix + 1], s.vel[ix + 2]);
        if (sp > MAX_SPEED) {
          const k = MAX_SPEED / sp;
          s.vel[ix] *= k;
          s.vel[ix + 1] *= k;
          s.vel[ix + 2] *= k;
        }
        s.pos[ix] += s.vel[ix] * dtF;
        s.pos[ix + 1] += s.vel[ix + 1] * dtF;
        s.pos[ix + 2] += s.vel[ix + 2] * dtF;

        // depth + hue (for links)
        s.depth[i] = Math.max(0, Math.min(1, (R - s.pos[ix + 2]) / (2 * R)));
        const slot = s.hueSlot[i];
        s.hue[i] =
          (palA[slot] + (palB[slot] - palA[slot]) * s.palBlend + s.hueJitter[i] + 360) % 360;
      }
      (pGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      // shockwave rings
      const rr = rings.current;
      for (let i = rr.length - 1; i >= 0; i--) {
        const ring = rr[i];
        ring.r += 1.1 * dtF * 0.16667 * 10; // ~1.1 world/s
        ring.life -= 0.02 * dtF;
        if (ring.life <= 0) rr.splice(i, 1);
      }

      // comet
      const c = comet.current;
      c.next -= dtS;
      if (!c.active && c.next <= 0) {
        const side = Math.random() < 0.5 ? 1 : -1;
        c.p.set(side * 8, (Math.random() - 0.5) * 6, 1 + Math.random() * 2);
        c.v.set(-side * (2.2 + Math.random() * 1.5), (Math.random() - 0.5) * 0.8, 0);
        c.life = 1;
        c.active = true;
      }
      if (c.active) {
        c.p.addScaledVector(c.v, dtS);
        c.life -= dtS * 0.05;
        if (Math.abs(c.p.x) > 9 || c.life <= 0) {
          c.active = false;
          c.next = 7 + Math.random() * 6;
        }
      }
    } else if (!s.staticPlaced) {
      // reduced motion: place once at the current shape, static
      const fn = SHAPES[s.shapeIdx].fn;
      for (let i = 0; i < COUNT; i++) {
        fn(i, COUNT, 0, target);
        s.pos[i * 3] = target.x;
        s.pos[i * 3 + 1] = target.y;
        s.pos[i * 3 + 2] = target.z;
        s.depth[i] = Math.max(0, Math.min(1, (R - target.z) / (2 * R)));
        const slot = s.hueSlot[i];
        s.hue[i] = (palA[slot] + s.hueJitter[i] + 360) % 360;
      }
      (pGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      s.staticPlaced = true;
    }

    uniforms.uTime.value = s.t;
    starUniforms.uTime.value = s.t;

    // star color follows palette slot 2
    const starHue = palA[2] + (palB[2] - palA[2]) * s.palBlend;
    const [sr, sg, sb] = hslToRgb(starHue, 0.6, 0.84);
    starUniforms.uColor.value.set(sr, sg, sb);

    // nebula sprites: slow rotation + palette tint
    const neb = nebulaRef.current;
    if (neb) neb.rotation.y = s.t * 0.06;
    for (let i = 0; i < 4; i++) {
      const m = nebMats.current[i];
      if (!m) continue;
      const hue = palA[i % 3] + (palB[i % 3] - palA[i % 3]) * s.palBlend;
      const [nr, ng, nb] = hslToRgb(hue, 0.8, 0.55);
      m.color.set(nr, ng, nb);
    }

    // rings
    for (let i = 0; i < ringRefs.current.length; i++) {
      const ref = ringRefs.current[i];
      if (!ref) continue;
      const ring = rings.current[i];
      if (ring && ring.r > 0) {
        ref.visible = true;
        ref.scale.setScalar(ring.r);
        (ref as unknown as { material: THREE.LineBasicMaterial }).material.opacity =
          Math.min(1, ring.life) * 0.5;
      } else {
        ref.visible = false;
      }
    }

    // comet render
    if (cometRef.current) {
      const c = comet.current;
      cometRef.current.visible = c.active;
      if (c.active) {
        cometRef.current.position.copy(c.p);
        const fade = Math.min(1, c.life * 5);
        cometMat.current!.opacity = 0.7 * fade;
        const hue = palA[1] + (palB[1] - palA[1]) * s.palBlend + 15;
        const [cr, cg, cb] = hslToRgb(hue, 0.9, 0.88);
        cometMat.current!.color.set(cr, cg, cb);
        const trail = cometTrailGeo.attributes.position as THREE.BufferAttribute;
        const l = c.v.length() || 1;
        trail.setXYZ(0, c.p.x, c.p.y, c.p.z);
        trail.setXYZ(1, c.p.x - (c.v.x / l) * 1.8, c.p.y - (c.v.y / l) * 1.8, c.p.z - (c.v.z / l) * 1.8);
        trail.needsUpdate = true;
        cometTrailMat.current!.color.set(cr, cg, cb);
        cometTrailMat.current!.opacity = 0.5 * fade;
      }
    }

    // links (distance-based constellation)
    {
      const lp = linkGeo.attributes.position as THREE.BufferAttribute;
      const lc = linkGeo.attributes.color as THREE.BufferAttribute;
      const lpd = lp.array as Float32Array;
      const lcd = lc.array as Float32Array;
      const maxD2 = LINK_DIST * LINK_DIST;
      let seg = 0;
      for (let i = 0; i < COUNT && seg < MAX_LINKS; i++) {
        const ix = i * 3;
        const ax = s.pos[ix];
        const ay = s.pos[ix + 1];
        const az = s.pos[ix + 2];
        const aDepth = s.depth[i];
        const aHue = s.hue[i];
        const aScale = Math.max(0.75, Math.min(1.3, 5.6 / (5.6 - az + 0.0001)));
        for (let j = i + 1; j < COUNT && seg < MAX_LINKS; j++) {
          const jx = j * 3;
          const dx = ax - s.pos[jx];
          const dy = ay - s.pos[jx + 1];
          const dz = az - s.pos[jx + 2];
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 > maxD2) continue;
          const d = Math.sqrt(d2);
          const depth = (aDepth + s.depth[j]) * 0.5;
          const alpha = (1 - d / LINK_DIST) * (0.1 + 0.3 * depth) * aScale;
          const hue = (aHue + s.hue[j]) * 0.5;
          colA.setHSL(hue / 360, 0.85, 0.66).multiplyScalar(alpha);
          colB.setHSL(s.hue[j] / 360, 0.85, 0.66).multiplyScalar(alpha);
          const o = seg * 6;
          lpd[o] = ax;
          lpd[o + 1] = ay;
          lpd[o + 2] = az;
          lpd[o + 3] = s.pos[jx];
          lpd[o + 4] = s.pos[jx + 1];
          lpd[o + 5] = s.pos[jx + 2];
          lcd[o] = colA.r;
          lcd[o + 1] = colA.g;
          lcd[o + 2] = colA.b;
          lcd[o + 3] = colB.r;
          lcd[o + 4] = colB.g;
          lcd[o + 5] = colB.b;
          seg++;
        }
      }
      lp.needsUpdate = true;
      lc.needsUpdate = true;
      linkGeo.setDrawRange(0, seg * 2);
    }

    // fps + telemetry
    s.fps = s.fps * 0.95 + (1000 / Math.max(1, delta * 1000)) * 0.05;
    s.fpsTimer += delta * 1000;
    s.telTimer += delta;
    if (s.telTimer > 0.5 && onTelemetry) {
      s.telTimer = 0;
      onTelemetry({
        shape: SHAPES[s.shapeIdx].name,
        palette: PALETTES[s.palIdx].name,
        fps: Math.round(s.fps),
        particles: COUNT,
      });
    }
  });

  const nebulaRef = useRef<THREE.Group>(null);
  const nebMats = useRef<(THREE.SpriteMaterial | null)[]>([]);
  const cometRef = useRef<THREE.Sprite>(null);
  const cometMat = useRef<THREE.SpriteMaterial>(null);
  const cometTrailMat = useRef<THREE.LineBasicMaterial>(null);

  const nebulaBlobs = useMemo(() => {
    const rng = mulberry32(42);
    return Array.from({ length: 4 }, (_, i) => {
      const d = fibDir(i, 4);
      return {
        p: [d.x * 3.0, d.y * 2.4, -2.6] as [number, number, number],
        size: 5 + rng() * 2.5,
      };
    });
  }, []);

  return (
    <group>
      <NameBackdrop />

      {/* particles */}
      <points geometry={pGeo} frustumCulled={false}>
        <shaderMaterial
          vertexShader={particleVert}
          fragmentShader={particleFrag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* constellation links */}
      <lineSegments geometry={linkGeo} frustumCulled={false}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* morph shockwave rings */}
      {[0, 1, 2].map((i) => (
        <lineLoop
          key={i}
          geometry={ringGeo}
          ref={(el) => {
            ringRefs.current[i] = el;
          }}
          visible={false}
        >
          <lineBasicMaterial
            color="#a5f3fc"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineLoop>
      ))}

      {/* nebula backdrops */}
      <group ref={nebulaRef}>
        {nebulaBlobs.map(({ p, size }, i) => (
          <sprite
            key={i}
            position={p}
            scale={[size, size, 1]}
          >
            <spriteMaterial
              ref={(el) => {
                nebMats.current[i] = el;
              }}
              map={glowTex}
              color="#34d399"
              transparent
              opacity={0.07}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
        ))}
      </group>

      {/* stars */}
      <points geometry={starGeo} frustumCulled={false}>
        <shaderMaterial
          vertexShader={starVert}
          fragmentShader={starFrag}
          uniforms={starUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* comet */}
      <sprite ref={cometRef} scale={[0.5, 0.5, 1]} visible={false}>
        <spriteMaterial
          ref={(el) => {
            cometMat.current = el;
          }}
          map={glowTex}
          color="#a5f3fc"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <primitive
        object={new THREE.Line(cometTrailGeo, new THREE.LineBasicMaterial())}
        attach="primitive"
        frustumCulled={false}
      >
        <lineBasicMaterial
          ref={(el) => {
            cometTrailMat.current = el;
          }}
          color="#a5f3fc"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </primitive>
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

function RotatingGroup({
  drag,
  reducedMotion,
  children,
}: {
  drag: React.MutableRefObject<DragState>;
  reducedMotion: boolean;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

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

  return <group ref={group}>{children}</group>;
}

export function GpuClusterScene({
  onTelemetry,
}: {
  onTelemetry?: (t: ClusterTelemetry) => void;
}) {
  // One random seed per page load → a different starting shape + palette
  // on every refresh, stable for the page lifetime (strict-mode safe).
  const [seed] = useState(() => Math.floor(Math.random() * 0x7fffffff));
  const seedShape = seed % SHAPES.length;
  const seedPalette = Math.floor(seed / SHAPES.length) % PALETTES.length;

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
  const onTelemetryCb = useCallback(
    (t: ClusterTelemetry) => {
      onTelemetry?.(t);
    },
    [onTelemetry]
  );

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
        camera={{ position: [0, 0.35, 5.6], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <RotatingGroup drag={drag} reducedMotion={reducedMotion}>
          <ConstellationCore
            reducedMotion={reducedMotion}
            seedShape={seedShape}
            seedPalette={seedPalette}
            onTelemetry={onTelemetryCb}
          />
        </RotatingGroup>
      </Canvas>
    </div>
  );
}

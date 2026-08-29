'use client';

import { useEffect, useState } from 'react';
import { StatusDot } from '@/components/ui/StatusDot';

interface GpuInfo {
  name: string;
  util?: number;
  temp?: number;
  memUsed?: number;
  memTotal?: number;
  power?: number;
}

interface NodeInfo {
  name: string;
  role?: string;
  online: boolean;
  gpus: GpuInfo[];
}

interface StatusData {
  generatedAt: string;
  nodes: NodeInfo[];
}

// Live copy via raw.githubusercontent (CORS open); bundled copy is the fallback.
const RAW_URL =
  'https://raw.githubusercontent.com/l064n/l064n.github.io/main/public/status.json';

function formatAge(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return 'unknown';
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function UtilBar({ value, active }: { value: number; active: boolean }) {
  return (
    <div className="h-1 w-16 overflow-hidden rounded-full bg-zinc-800">
      <div
        className={`h-full rounded-full transition-all duration-700 ${
          active ? 'bg-accent' : 'bg-zinc-700'
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function ClusterStatus() {
  const [data, setData] = useState<StatusData | null>(null);
  const [stale, setStale] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(RAW_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as StatusData;
        if (!cancelled && Array.isArray(json.nodes)) {
          setData(json);
          setStale(false);
        }
      } catch {
        if (!cancelled) setStale(true);
      }
    };

    load();
    const interval = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Fallback: bundled snapshot (committed by the collector)
  useEffect(() => {
    let cancelled = false;
    fetch('/status.json', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('http'))))
      .then((json: StatusData) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return <div className="px-2 py-1 font-mono text-xs text-zinc-600">cluster: querying…</div>;
  }

  const onlineNodes = data.nodes.filter((n) => n.online).length;
  const totalGpus = data.nodes.reduce((sum, n) => sum + n.gpus.length, 0);

  return (
    <div className="border-t border-zinc-800/60 pt-3">
      {/* header line */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-y-1 px-2 font-mono text-[11px] text-zinc-600">
        <span>
          <span className="text-accent">cluster</span> status —{' '}
          {onlineNodes}/{data.nodes.length} nodes · {totalGpus} gpus
        </span>
        <span className={stale ? 'text-amber-500/80' : undefined}>
          {stale ? 'stale · ' : ''}updated {formatAge(data.generatedAt)}
        </span>
      </div>

      {/* node rows */}
      <div className="space-y-1">
        {data.nodes.map((node) => (
          <div
            key={node.name}
            className="flex items-start gap-x-3 rounded px-2 -mx-2 py-0.5 font-mono text-xs hover:bg-white/[0.02]"
          >
            <span className="flex w-24 shrink-0 items-center gap-2 pt-[3px] text-zinc-500 sm:w-28">
              <StatusDot variant={node.online ? 'online' : 'offline'} pulse={false} />
              <span className="truncate">{node.name}</span>
            </span>

            {/* GPU readings wrap as a group so they stay left-aligned with
                each other (never under the node name) on narrow screens. */}
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1">
              {node.online && node.gpus.length === 0 && (
                <span className="text-zinc-600">idle (no smi telemetry)</span>
              )}

              {node.gpus.map((gpu, i) => (
                <span key={i} className="flex items-center gap-2">
                  <UtilBar value={gpu.util ?? 0} active={(gpu.util ?? 0) > 5} />
                  <span className="text-zinc-500">{gpu.util ?? 0}%</span>
                  {typeof gpu.temp === 'number' && (
                    <span
                      className={
                        gpu.temp > 85 ? 'text-red-400/90' : gpu.temp > 70 ? 'text-amber-500/80' : 'text-zinc-600'
                      }
                    >
                      {gpu.temp}°C
                    </span>
                  )}
                  {typeof gpu.power === 'number' && (
                    <span className="hidden text-zinc-700 sm:inline">{Math.round(gpu.power)}W</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

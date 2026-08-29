#!/usr/bin/env python3
"""Collect GPU telemetry from the local node and print a JSON object to stdout.

Expected environment:
  NAME  display name of this node (used in the site readout)
  ROLE  optional role label (compute, inference, training, embedded, ...)

Supports nvidia-smi (NVIDIA / Jetson) and rocm-smi (AMD, incl. rocm-smi 3.x
output format). Unsupported fields (e.g. Jetson utilization) are reported as
null — the node still reports online.
"""

import json
import os
import re
import shutil
import subprocess
import sys


def run(cmd, timeout=12):
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        return result.stdout or ""
    except Exception:
        return ""


def num(value):
    """Parse a numeric field that may be 'N/A', '[N/A]' or empty."""
    if value is None:
        return None
    v = str(value).strip().lstrip("[]").rstrip("]").strip()
    try:
        return float(v)
    except ValueError:
        return None


def collect_nvidia():
    if not shutil.which("nvidia-smi"):
        return None
    out = run(
        [
            "nvidia-smi",
            "--query-gpu=name,utilization.gpu,temperature.gpu,memory.used,memory.total,power.draw",
            "--format=csv,noheader,nounits",
        ]
    )
    gpus = []
    for line in out.strip().splitlines():
        parts = [p.strip() for p in line.split(",")]
        if len(parts) < 6:
            continue
        name = parts[0]
        util = num(parts[1])
        temp = num(parts[2])
        mem_used = num(parts[3])
        mem_total = num(parts[4])
        power = num(parts[5])
        gpus.append(
            {
                "name": name,
                "util": int(util) if util is not None else None,
                "temp": int(temp) if temp is not None else None,
                "memUsed": round(mem_used / 1024, 1) if mem_used is not None else None,
                "memTotal": round(mem_total / 1024, 1) if mem_total is not None else None,
                "power": round(power, 1) if power is not None else None,
            }
        )
    return gpus or None


def gpu_chip_names():
    """Best-effort per-GPU chip names from lspci (skips BMC/embedded VGA)."""
    out = run(["lspci"])
    names = {}
    n = 0
    for line in out.splitlines():
        low = line.lower()
        if not any(k in low for k in ("vga", "display controller", "3d controller")):
            continue
        if any(k in low for k in ("aspeed", "nvidia", "cirrus", "qxl", "vmware", "virtual")):
            continue
        part = line.split(":", 2)[-1].strip()
        # "Advanced Micro Devices, Inc. [AMD/ATI] Vega 20 [Radeon Pro ...]" -> "Vega 20"
        chip = part.split("[AMD/ATI]")[-1].strip()
        chip = re.sub(r"\s*\[.*\]", "", chip).strip()
        if chip:
            names[str(n)] = chip
        n += 1
    return names


def collect_rocm():
    if not shutil.which("rocm-smi"):
        return None
    stats = run(["rocm-smi", "--showuse", "--showtemp", "--showpower"])
    vram = run(["rocm-smi", "--showmeminfo", "vram"])
    names = gpu_chip_names()

    data = {}

    def idx(gpu, key, value):
        data.setdefault(gpu, {})[key] = value

    # utilization (same in old and new formats)
    for m in re.finditer(r"GPU\[(\d+)\]\s*:\s*GPU use \(%\)\s*:\s*(\d+)", stats):
        idx(m.group(1), "util", int(m.group(2)))
    # temperature: rocm-smi 3.x "Temperature (Sensor edge) (C)", legacy "GPU temp (degC)"
    for m in re.finditer(
        r"GPU\[(\d+)\]\s*:\s*(?:Temperature \(Sensor edge\)|GPU temp) \((?:C|degC)\)\s*:\s*([\d.]+)",
        stats,
    ):
        idx(m.group(1), "temp", int(float(m.group(2))))
    # power: rocm-smi 3.x "Current Socket Graphics Package Power (W)", legacy "GPU power (W)"
    for m in re.finditer(
        r"GPU\[(\d+)\]\s*:\s*(?:Current Socket Graphics Package Power|GPU power) \(W\)\s*:\s*([\d.]+)",
        stats,
    ):
        idx(m.group(1), "power", float(m.group(2)))
    # memory: rocm-smi 3.x reports bytes via --showmeminfo vram
    for m in re.finditer(r"GPU\[(\d+)\]\s*:\s*VRAM Total Used Memory \(B\)\s*:\s*(\d+)", vram):
        idx(m.group(1), "memUsed", round(int(m.group(2)) / 1024**3, 1))
    for m in re.finditer(r"GPU\[(\d+)\]\s*:\s*VRAM Total Memory \(B\)\s*:\s*(\d+)", vram):
        idx(m.group(1), "memTotal", round(int(m.group(2)) / 1024**3, 1))
    # legacy rocm-smi reported MB in the stats table
    for m in re.finditer(r"GPU\[(\d+)\]\s*:\s*GPU memory use \(MB\)\s*:\s*(\d+)", stats):
        idx(m.group(1), "memUsed", round(int(m.group(2)) / 1024, 1))
    for m in re.finditer(r"GPU\[(\d+)\]\s*:\s*GPU memory total \(MB\)\s*:\s*(\d+)", stats):
        idx(m.group(1), "memTotal", round(int(m.group(2)) / 1024, 1))

    if not data:
        return None

    gpus = []
    for i in sorted(data, key=int):
        gpu = data[i]
        gpus.append(
            {
                "name": gpu.get("name") or names.get(i) or f"AMD GPU {i}",
                "util": gpu.get("util"),
                "temp": gpu.get("temp"),
                "memUsed": gpu.get("memUsed"),
                "memTotal": gpu.get("memTotal"),
                "power": gpu.get("power"),
            }
        )
    return gpus


def main():
    name = os.environ.get("NAME", "node")
    role = os.environ.get("ROLE", "")
    gpus = collect_nvidia() or collect_rocm() or []
    print(
        json.dumps(
            {
                "name": name,
                "role": role,
                "online": True,
                "gpus": gpus,
            }
        )
    )


if __name__ == "__main__":
    main()

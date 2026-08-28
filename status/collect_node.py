#!/usr/bin/env python3
"""Collect GPU telemetry from the local node and print a JSON object to stdout.

Expected environment:
  NAME  display name of this node (used in the site readout)
  ROLE  optional role label (inference, training, embedded, ...)

Supports nvidia-smi (NVIDIA), rocm-smi (AMD), and falls back to an empty
GPU list (e.g. Jetson, where no smi tool exists) — the node still reports
online.
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
        try:
            gpus.append(
                {
                    "name": parts[0],
                    "util": int(float(parts[1])),
                    "temp": int(float(parts[2])),
                    "memUsed": round(float(parts[3]) / 1024, 1),
                    "memTotal": round(float(parts[4]) / 1024, 1),
                    "power": round(float(parts[5]), 1),
                }
            )
        except ValueError:
            continue
    return gpus or None


def collect_rocm():
    if not shutil.which("rocm-smi"):
        return None
    table = run(["rocm-smi", "--showuse", "--showtemp", "--showmemuse", "--showpower"])
    names = run(["rocm-smi"])

    data = {}

    def idx(idx, key, value):
        data.setdefault(idx, {})[key] = value

    for m in re.finditer(r"GPU\[(\d+)\]\s*:\s*GPU use \(%\)\s*:\s*(\d+)", table):
        idx(m.group(1), "util", int(m.group(2)))
    for m in re.finditer(r"GPU\[(\d+)\]\s*:\s*GPU temp \(degC\)\s*:\s*(\d+)", table):
        idx(m.group(1), "temp", int(m.group(2)))
    for m in re.finditer(r"GPU\[(\d+)\]\s*:\s*GPU memory use \(MB\)\s*:\s*(\d+)", table):
        idx(m.group(1), "memUsed", round(int(m.group(2)) / 1024, 1))
    for m in re.finditer(r"GPU\[(\d+)\]\s*:\s*GPU memory total \(MB\)\s*:\s*(\d+)", table):
        idx(m.group(1), "memTotal", round(int(m.group(2)) / 1024, 1))
    for m in re.finditer(r"GPU\[(\d+)\]\s*:\s*GPU power \(W\)\s*:\s*([\d.]+)", table):
        idx(m.group(1), "power", float(m.group(2)))
    for m in re.finditer(r"GPU\[(\d+)\]\s*:\s*Device Name:\s*(.+)", names):
        idx(m.group(1), "name", m.group(2).strip())

    if not data:
        return None

    gpus = []
    for i in sorted(data, key=int):
        gpu = data[i]
        gpus.append(
            {
                "name": gpu.get("name", f"AMD GPU {i}"),
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

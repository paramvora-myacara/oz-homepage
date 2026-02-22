#!/usr/bin/env python3
"""
Trim the full OZ GeoJSON at the JSON level (no geometry simplification).

- Drops FeatureCollection-level `crs` (WGS84 is GeoJSON default).
- Per feature: keeps `type` and `geometry`; optionally keeps `id`.
- Drops all feature `properties` (OBJECTID, GEOID10, STATE, etc.) so the map
  only has what’s needed to draw.
- Rounds coordinates to a given number of decimals (default 6 ≈ 0.1 m; enough
  to draw and for point-in-polygon). Does NOT remove or simplify vertices.

Usage:
  python3 scripts/trim-oz-geojson.py input.geojson -o output.geojson
  python3 scripts/trim-oz-geojson.py input.geojson -o output.geojson --decimals 5 --keep-id

Requires: Python 3.6+
Note: Loads the full input into memory (~2–3× file size). For the 163MB file, ensure enough RAM.
"""

import argparse
import json
import sys


def round_coords(obj, decimals: int):
    if isinstance(obj, list):
        return [round_coords(x, decimals) for x in obj]
    if isinstance(obj, float):
        return round(obj, decimals)
    return obj


def trim_feature(feature: dict, decimals: int, keep_id: bool) -> dict:
    geom = feature.get("geometry")
    if not geom or "coordinates" not in geom:
        return None
    out = {
        "type": "Feature",
        "geometry": {
            "type": geom["type"],
            "coordinates": round_coords(geom["coordinates"], decimals),
        },
    }
    if keep_id and "id" in feature:
        out["id"] = feature["id"]
    return out


def main():
    ap = argparse.ArgumentParser(description="Trim OZ GeoJSON: drop properties, round coords, optional id.")
    ap.add_argument("input", help="Path to input GeoJSON (e.g. full 163MB file)")
    ap.add_argument("-o", "--output", required=True, help="Path to output trimmed GeoJSON")
    ap.add_argument(
        "--decimals",
        type=int,
        default=6,
        help="Coordinate decimal places (6 ≈ 0.1m, 5 ≈ 1m). Default 6.",
    )
    ap.add_argument("--keep-id", action="store_true", help="Keep feature id in output")
    args = ap.parse_args()

    print(f"Reading {args.input} ...", file=sys.stderr)
    with open(args.input) as f:
        data = json.load(f)

    if data.get("type") != "FeatureCollection" or "features" not in data:
        print("Error: expected a FeatureCollection with 'features'", file=sys.stderr)
        sys.exit(1)

    features = data["features"]
    print(f"Features: {len(features)}", file=sys.stderr)

    out_fc = {"type": "FeatureCollection", "features": []}
    for i, f in enumerate(features):
        t = trim_feature(f, args.decimals, args.keep_id)
        if t:
            out_fc["features"].append(t)
        if (i + 1) % 1000 == 0:
            print(f"  trimmed {i + 1} ...", file=sys.stderr)

    print(f"Writing {args.output} ...", file=sys.stderr)
    with open(args.output, "w") as f:
        json.dump(out_fc, f, separators=(",", ":"))

    print("Done.", file=sys.stderr)


if __name__ == "__main__":
    main()

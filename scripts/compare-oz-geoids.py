#!/usr/bin/env python3
"""
Compare GEOIDs in the OZ checker list (oz-geoid-minimal.json) with the
GEOIDs in the full GeoJSON. Reports whether they are the same set and
any differences.

Usage:
  python3 scripts/compare-oz-geoids.py [path-to-full.geojson]
  Default full path: ~/Downloads/Opportunity_Zones_2244808886865986276.geojson
"""

import json
import os
import sys

# Paths relative to repo root
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MINIMAL_PATH = os.path.join(REPO_ROOT, "public", "data", "oz-geoid-minimal.json")
DEFAULT_FULL_PATH = os.path.join(
    os.path.expanduser("~"),
    "Downloads",
    "Opportunity_Zones_2244808886865986276.geojson",
)


def load_minimal_geoids():
    with open(MINIMAL_PATH) as f:
        data = json.load(f)
    geoids = data.get("geoids", [])
    return set(geoids), len(geoids)


def load_geoids_from_full_streaming(path):
    """Extract GEOID10 from each feature using ijson if available (low memory)."""
    try:
        import ijson
    except ImportError:
        return load_geoids_from_full_load(path)

    geoids = set()
    count = 0
    with open(path, "rb") as f:
        for feature in ijson.items(f, "features.item"):
            count += 1
            props = feature.get("properties") or {}
            g = props.get("GEOID10")
            if g is not None:
                geoids.add(str(g).strip())
            if count % 1000 == 0:
                print(f"  ... {count} features", file=sys.stderr)
    return geoids, count


def load_geoids_from_full_load(path):
    """Extract GEOID10 from each feature by loading the whole file (high memory)."""
    print("  (Loading full file into memory; may use significant RAM)", file=sys.stderr)
    with open(path) as f:
        data = json.load(f)
    features = data.get("features") or []
    geoids = set()
    for f in features:
        props = f.get("properties") or {}
        g = props.get("GEOID10")
        if g is not None:
            geoids.add(str(g).strip())
    return geoids, len(features)


def main():
    full_path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_FULL_PATH
    if not os.path.isfile(full_path):
        print(f"Error: Full GeoJSON not found: {full_path}", file=sys.stderr)
        sys.exit(1)
    if not os.path.isfile(MINIMAL_PATH):
        print(f"Error: Minimal GEOID file not found: {MINIMAL_PATH}", file=sys.stderr)
        sys.exit(1)

    print("Loading checker GEOIDs (oz-geoid-minimal.json)...", file=sys.stderr)
    checker_set, checker_count = load_minimal_geoids()
    print(f"  Checker: {checker_count} GEOIDs", file=sys.stderr)

    print(f"Loading full GeoJSON: {full_path}", file=sys.stderr)
    full_set, full_features = load_geoids_from_full_streaming(full_path)
    full_unique = len(full_set)
    print(f"  Full file: {full_features} features, {full_unique} unique GEOID10", file=sys.stderr)

    # Compare
    only_in_checker = checker_set - full_set
    only_in_full = full_set - checker_set
    in_both = checker_set & full_set

    print()
    print("=== Comparison ===")
    print(f"Checker list count:     {checker_count}")
    print(f"Full file feature count: {full_features}")
    print(f"Full file unique GEOID10: {full_unique}")
    print(f"In both:               {len(in_both)}")
    print(f"Only in checker list:  {len(only_in_checker)}")
    print(f"Only in full GeoJSON:   {len(only_in_full)}")
    print()

    if only_in_checker:
        print("GEOIDs in checker list but NOT in full GeoJSON (first 20):")
        for g in sorted(only_in_checker)[:20]:
            print(f"  {g}")
        if len(only_in_checker) > 20:
            print(f"  ... and {len(only_in_checker) - 20} more")
        print()

    if only_in_full:
        print("GEOIDs in full GeoJSON but NOT in checker list (first 20):")
        for g in sorted(only_in_full)[:20]:
            print(f"  {g}")
        if len(only_in_full) > 20:
            print(f"  ... and {len(only_in_full) - 20} more")
        print()

    if not only_in_checker and not only_in_full and checker_count == full_unique:
        print("Result: Checker list and full GeoJSON have the EXACT same 8,765 zones (same GEOID set).")
    else:
        print("Result: Lists DIFFER. Consider regenerating oz-geoid-minimal.json from the full GeoJSON.")


if __name__ == "__main__":
    main()

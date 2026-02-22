# Trimming the OZ GeoJSON (full dataset)

## What’s in the full file (~163 MB)

- **FeatureCollection** with `crs: { type: "name", properties: { name: "EPSG:4326" } }` (WGS84 — optional; GeoJSON default is WGS84).
- **8,765 features.** Each feature has:
  - `type`: `"Feature"`
  - `id`: number (1–8765)
  - `geometry`: `Polygon` (or `MultiPolygon`) with **coordinates at 13 decimal places** (~0.1 micron precision).
  - `properties`:  
    `OBJECTID`, `GEOID10`, `STATE`, `COUNTY`, `TRACT`, `STUSAB`, `STATE_NAME`

## What we need to draw the map

- **Required:** `type`, `geometry` (type + coordinates).
- **Optional:** `id` (e.g. for click handlers or debugging).
- **Not needed for drawing:** `properties` (all of them), `crs` at collection level.

## Trim at JSON level (no geometry simplification)

| Change | Effect | Safe? |
|--------|--------|--------|
| Drop `crs` | Slightly smaller; WGS84 is default | Yes |
| Drop every feature’s `properties` | Large savings (no OBJECTID, GEOID10, STATE, etc.) | Yes, if you don’t need them for UI/API |
| Keep only `id` (or one short property) | Small; useful for “which zone was clicked” | Yes |
| Round coordinates to **6 decimals** | ~0.1 m precision; enough to draw and for point-in-polygon | Yes (visually lossless) |
| Round to **5 decimals** | ~1 m; still fine for display | Yes (slightly smaller) |

**Do not:** simplify or remove vertices (that’s lossy and caused the missing zones). Only **round** existing coordinates.

Rough size impact (from sampling one feature):

- Full feature (with properties, 13 decimals): ~14 KB JSON.
- Trimmed (geometry only, 6 decimals): ~8.5 KB (~61% of full).
- So the whole file can drop to roughly **60–65%** of 163 MB (~100 MB) from trim alone. Then **gzip** on transfer (e.g. server sends `Content-Encoding: gzip`) often gives another ~5–10×, so you can end up in the **~15–25 MB** range over the wire.

## Compression (after trim)

1. **Trim first** (this script): drop `crs`, drop feature `properties`, round coordinates to 6 (or 5) decimals. Result: ~60–65% of original size, all zones and vertices kept.
2. **Then serve with gzip (or Brotli):** Enable `Content-Encoding: gzip` on your server (or use Vercel’s default). The browser requests the file, server sends compressed response, browser decompresses and parses. No map code change. Typically another ~5–10× smaller over the wire, so trimmed 100 MB → ~15–25 MB transferred.
3. **Optional:** Binary formats (Geobuf / FlatGeobuf) for even smaller file and faster parse; still lossless.

## Script

Run:

```bash
python3 scripts/trim-oz-geojson.py /path/to/full.geojson -o public/data/opportunity-zones-trimmed.geojson
# Optional: keep feature id, or use 5 decimals for slightly smaller file
python3 scripts/trim-oz-geojson.py /path/to/full.geojson -o public/data/opportunity-zones-trimmed.geojson --keep-id --decimals 5
```

Then ensure the map loads the trimmed file and your server (or host) serves it with gzip/Brotli.

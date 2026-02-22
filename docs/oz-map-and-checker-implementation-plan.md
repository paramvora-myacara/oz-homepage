# OZ Map & Checker Implementation Plan

This document captures the implementation plan for the Opportunity Zone map and “Check if in OZ” feature, based on findings and decisions from February 2025.

---

## 1. Problem summary

- **Map:** The production map used a **lossy-compressed** GeoJSON (`opportunity-zones-compressed.geojson`), which was missing or distorting OZ boundaries and produced an inaccurate map.
- **Checker:** The “is this address/point in an OZ?” flow is **GEOID-based** (Census geocode → tract GEOID → lookup in a list). Wrong or incomplete results were suspected to come from the same underlying data (incomplete GEOID list), not from the Census API itself.
- **Full dataset:** The original, uncompressed OZ GeoJSON (~163 MB, in Downloads) was confirmed to show correct boundaries and is the source of truth.

---

## 2. What’s already in place

- **Comparison map (dev only):** A second map on `/map` loads the full OZ data from `~/Downloads` via `/api/oz-full-geojson` (streamed from disk). It uses the same pin/pan state as the main map so you can compare “compressed” vs “full” and confirm accuracy. See `src/app/map/MapFullData.tsx` and the “Full dataset map” section in `MapClient.tsx`.
- **Trim script:** `scripts/trim-oz-geojson.py` trims the full GeoJSON at the JSON level (no vertex removal): drops `crs`, drops all feature `properties`, rounds coordinates to 6 or 5 decimals. See `scripts/trim-oz-geojson.md` for details and usage.
- **API route:** `src/app/api/oz-full-geojson/route.ts` streams the full GeoJSON from `OZ_FULL_GEJSON_PATH` or `~/Downloads/Opportunity_Zones_2244808886865986276.geojson` for the comparison map.

---

## 3. Data strategy (no binary, no vector tiles)

- **Goal:** All OZ data visible on the map; single GeoJSON (trimmed) served to the client; no viewport-based tiling for now.
- **Approach:** Trim the full GeoJSON (lossless in terms of vertices), serve it as static JSON, and rely on Vercel’s automatic compression (gzip/Brotli) for transfer.

---

## 4. Trim and file sizes

| Step | Approx. size | Notes |
|------|---------------|--------|
| Full GeoJSON (current source) | ~163 MB | 8,765 features; 13-decimal coords; full `properties`. |
| After trim (6 decimals, no `properties`, no `crs`) | ~100 MB | Script: `trim-oz-geojson.py`. |
| After trim with 5 decimals | ~90–92 MB | Slightly smaller; still fine for display. |
| Over the wire (gzip) | ~15–20 MB | Vercel compresses automatically. |
| Over the wire (Brotli, when supported) | ~12–18 MB | Vercel chooses based on `Accept-Encoding`. |

**Implementation:** Run the trim script once against the full file, output to e.g. `public/data/opportunity-zones-trimmed.geojson`, then point the main map at this file (and remove or repurpose the old compressed file).

---

## 5. Compression (Vercel)

- **What:** Gzip and Brotli are **lossless**; the browser receives compressed bytes and decompresses before parsing. No geometry or attributes change.
- **Who does it:** Vercel’s CDN compresses static assets (including JSON) automatically. It uses the request’s `Accept-Encoding` to serve Brotli when the client supports it, otherwise gzip. No project config required.
- **Billing:** You pay for **bandwidth** (data transferred). Compression reduces that number (e.g. ~100 MB file → ~15–20 MB billed). There is no separate “compression compute” charge; compression lowers cost.

---

## 6. OZ checker: fix wrong results with GeoJSON properties

**Current flow:**

1. Load OZ GEOID list from `/data/oz-geoid-minimal.json` (8,765 11-digit tract GEOIDs).
2. **Address:** Geocode via Census (or Google fallback → Census reverse) → get census tract GEOID → `Set.has(geoid)`.
3. **Coordinates:** Reverse geocode (lat, lng) via Census → get tract GEOID → `Set.has(geoid)`.

**Likely cause of wrong results:** The GEOID list may have been derived from the same lossy or outdated source as the old map, so it can be incomplete or incorrect.

**Fix (reuse full GeoJSON properties):** The full GeoJSON has one feature per OZ polygon with `properties.GEOID10` (11-digit census tract ID). Build the authoritative OZ list by extracting **all unique `feature.properties.GEOID10`** from the full GeoJSON and regenerate `public/data/oz-geoid-minimal.json` in the same shape (`{ "geoids": [ ... ] }`). Keep the existing checker flow (Census → GEOID → lookup); only the list’s source changes. No point-in-polygon needed; the checker stays GEOID-based.

**Implementation:** Add a small script (or one-off) that: reads the full GeoJSON (or the trimmed one if you keep `GEOID10` in a single pass), collects unique `GEOID10`, and writes `oz-geoid-minimal.json`. Run it whenever the source OZ dataset is updated.

**Verification (Feb 2025):** A comparison script was run: `scripts/compare-oz-geoids.py` compares `oz-geoid-minimal.json` with the full GeoJSON. Result: **the checker list and the full GeoJSON have the exact same 8,765 GEOIDs** (0 only in checker, 0 only in full). So the GEOID list is not incomplete relative to the full file; if users still see wrong results, possible causes include Census geocoding returning a different tract at boundaries, or address parsing differences.

---

## 7. Implementation checklist

- [ ] **Trim the full GeoJSON**  
  Run `scripts/trim-oz-geojson.py` on the full file; output to e.g. `public/data/opportunity-zones-trimmed.geojson`. Option: `--keep-id --decimals 5` if you want slightly smaller size.

- [ ] **Switch the main map to trimmed data**  
  In `MapClient.tsx` (and any other consumers), change the GeoJSON URL from `opportunity-zones-compressed.geojson` to `opportunity-zones-trimmed.geojson` (or whatever path you chose).

- [x] **OZ GEOID list**  
  Verified with `scripts/compare-oz-geoids.py`: `oz-geoid-minimal.json` already has the exact same 8,765 GEOIDs as the full GeoJSON. No update needed. Only regenerate if the source OZ dataset is replaced or updated.

- [ ] **Remove or repurpose the comparison map (optional)**  
  Once the main map uses the trimmed full data, you can remove the “Full dataset map” section and the `/api/oz-full-geojson` route, or keep them behind a flag for occasional verification.

- [ ] **Confirm compression**  
  Deploy to Vercel and verify the GeoJSON response has `Content-Encoding: gzip` or `br` and that transfer size is in the ~12–25 MB range.

---

## 8. What we’re not doing (for now)

- **Vector tiles:** Would reduce transfer by sending only tiles for the viewport. Google Maps Data layer doesn’t accept vector tiles directly; we’d have to fetch tiles, convert to GeoJSON per tile, and call `addGeoJson`. Deferred; we want the full dataset visible in one go.

- **Binary format (Geobuf / FlatGeobuf):** Would yield ~15–25 MB file size (vs ~100 MB trimmed JSON) but Google Maps cannot load binary; the client would have to decode to GeoJSON and then call `map.data.addGeoJson()`. Deferred in favor of trimmed JSON + Vercel compression.

- **Server-side “check OZ” (point-in-polygon):** Possible future option (e.g. backend with full GeoJSON or PostGIS). Current plan is to fix the GEOID list from the full GeoJSON and keep the existing client-side GEOID lookup.

---

## 9. Reference

- **Trim script and data notes:** `scripts/trim-oz-geojson.md`
- **Trim script:** `scripts/trim-oz-geojson.py`
- **OZ checker logic:** `src/lib/ozChecker.js` (loads `oz-geoid-minimal.json`; uses Census via `src/app/api/census-geocoder/route.js`)
- **Map components:** `src/app/map/MapClient.tsx`, `src/app/map/MapFullData.tsx`
- **Full GeoJSON API (dev):** `src/app/api/oz-full-geojson/route.ts`
- **GEOID comparison script:** `scripts/compare-oz-geoids.py` — run to verify checker list matches full GeoJSON (`python3 scripts/compare-oz-geoids.py [path-to-full.geojson]`).

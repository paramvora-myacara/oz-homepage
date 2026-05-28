---
name: create-new-listing
description: End-to-end workflow for publishing a new listing — Supabase listings/listing_versions, oz_projects marketplace SQL, lifecycle status, and images. Use when adding a listing, going live, debugging inserts, or after the doc-processor pipeline.
---

# Create New Listing

Publishing a listing requires **two Supabase tracks** that share the same slug:

| Track | Tables / storage | Powers |
|-------|------------------|--------|
| **Detail page** | `listings` + `listing_versions` | `/listings/[slug]` — full JSON content |
| **Marketplace card** | `oz_projects` | `/listings` grid — IRR, min investment, summary |

Both must use the **same slug** (e.g. `the-bridge-district-va`). The local JSON in `oz-homepage/src/lib/listings/` is **not** auto-deployed; production reads Supabase.

---

## Checklist

1. [ ] Final listing JSON ready (from doc-processor output or editor)
2. [ ] Copy JSON to `oz-homepage/src/lib/listings/` (keep in sync with `oz-doc-processor/.../outputs/` if applicable)
3. [ ] Insert `listings` → `listing_versions` → update `current_version_id` (see below)
4. [ ] Set `listings.lifecycle_status = 'live'` (required for public detail page)
5. [ ] Add `oz_projects` insert SQL in repo and run in Supabase (see below)
6. [ ] Upload hero images to `oz-projects-images` bucket: `{slug}-001/general/`
7. [ ] Associate admin users via `admin_user_listings`

---

## Detail page — insertion order (required)

Circular FK between `listings` and `listing_versions`:

1. **Insert `listings`** — without `current_version_id`
2. **Insert `listing_versions`** — with `listing_id` pointing to the new listing
3. **Update `listings`** — set `current_version_id` to the new version's id

Never set both foreign keys in one step. Prefer a transaction.

### Tables

- **`listings`**: id, slug, title, has_vault, developer_contact_email, lifecycle_status, current_version_id, created_at, updated_at
- **`listing_versions`**: id, listing_id, version_number, data (JSONB), created_at, published_at, news_links
- **`admin_user_listings`**: user_id, listing_slug

### Example (minimal)

```sql
-- Step 1
INSERT INTO listings (id, slug, title, has_vault, developer_contact_email, lifecycle_status, created_at, updated_at)
VALUES ('listing-uuid', 'your-slug', 'Your Listing Title', true, 'dev@example.com', 'draft', NOW(), NOW());

-- Step 2
INSERT INTO listing_versions (id, listing_id, version_number, data, created_at, published_at, news_links)
VALUES ('version-uuid', 'listing-uuid', 1, '{...}'::jsonb, NOW(), NOW(), ARRAY[]::jsonb[]);

-- Step 3
UPDATE listings
SET current_version_id = 'version-uuid', lifecycle_status = 'live', updated_at = NOW()
WHERE slug = 'your-slug';
```

### Go live

The detail page requires **both** `lifecycle_status = 'live'` and a non-null `current_version_id`. Setting `current_version_id` alone is not enough.

There is no dashboard toggle for lifecycle status. Options:

- SQL: `UPDATE listings SET lifecycle_status = 'live' WHERE slug = '...';`
- Editor Save on `/dashboard/listings/[slug]` (sets live automatically, if you have admin access)

### After creating a listing

```sql
INSERT INTO admin_user_listings (user_id, listing_slug) VALUES
  ((SELECT id FROM admin_users WHERE email = 'admin@example.com'), 'your-slug')
ON CONFLICT (user_id, listing_slug) DO NOTHING;
```

---

## Marketplace — `oz_projects` SQL (required)

Every new listing needs a matching row in `public.oz_projects` or it **will not appear** on `/listings`.

### Where to add the file

Create a new insert file alongside existing ones:

```
oz-dev-dash/supabase/oz_projects_inserts/insert_<project>_oz_projects.sql
```

Add a row to `oz-dev-dash/supabase/oz_projects_inserts/README.md`.

### Critical rules

- **`project_slug` must equal `listings.slug`** exactly
- **`projected_irr_10yr`** — display scale (e.g. `19` = 19%, **not** `0.19`)
- **`equity_multiple_10yr`** — display scale (e.g. `3.08` = 3.08x)
- **`minimum_investment`** — dollars as integer (e.g. `250000`), or `NULL`
- No unique constraint on `project_slug`; delete existing rows before re-seeding:

```sql
DELETE FROM public.oz_projects WHERE project_slug = 'your-slug';
```

### Template

```sql
-- Insert oz_projects for [Project Name].
-- project_slug must match listings.slug on the homepage.
-- IRR is stored at display scale (e.g. 13 = 13%), not decimal (0.13).
-- Note: No unique on project_slug; re-running inserts new rows. Delete existing by slug first if re-seeding.

INSERT INTO public.oz_projects (
  project_id,
  project_name,
  project_slug,
  executive_summary,
  property_type,
  status,
  state,
  construction_type,
  minimum_investment,
  projected_irr_10yr,
  equity_multiple_10yr,
  fund_type,
  property_class
) VALUES
  (
    gen_random_uuid(),
    'Your Listing Title',
    'your-slug',
    'One- to two-sentence marketplace summary drawn from the listing JSON or OM.',
    'Multifamily',
    NULL,
    'DC',
    'Ground Up',
    250000,
    13,
    NULL,
    'Single-Asset',
    'class-A'
  );
```

Pull metrics from the listing JSON / source docs. Use `NULL` for fields not stated in source materials (do not invent IRR or equity multiple).

### Run in Supabase

Execute the insert file in the SQL Editor after the `listings` row exists (order between the two tracks does not matter, but slug must match).

---

## Images

Marketplace and hero images load from Supabase Storage, not the JSON:

- **Bucket:** `oz-projects-images`
- **Path:** `{slug}-001/general/` (projectId = `{slug}-001`)

Upload at least one image for the marketplace card to show a thumbnail.

---

## Common pitfalls

- Wrong insertion order: always listing → listing_version → update listing
- Forgetting `current_version_id` update (step 3)
- Forgetting `lifecycle_status = 'live'` for the detail page
- **`oz_projects` row missing** — listing detail works but card never appears on `/listings`
- **`project_slug` ≠ `listings.slug`** — metrics and card lookup fail silently
- IRR stored as decimal instead of display percent
- Setting both listing FKs in one insert (circular dependency error)

---

## References

- **Listing + version inserts:** `oz-dev-dash/docs/listing-insertion-guide.md`
- **oz_projects examples:** `oz-dev-dash/supabase/oz_projects_inserts/`
- **Doc-processor pipeline:** `oz-doc-processor/.cursor/skills/listing-doc-pipeline/SKILL.md`
- **JSON verification:** `oz-doc-processor/.cursor/skills/listing-verify/SKILL.md`

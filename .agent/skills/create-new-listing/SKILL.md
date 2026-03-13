---
name: create-new-listing
description: Inserts new listings into the shared Supabase database following the required order for listings and listing_versions. Use when adding a new listing, debugging listing inserts, or when the user asks how to create or insert a listing.
---

# Create New Listing

Use this skill when inserting a new listing into the database. The schema has circular foreign keys between `listings` and `listing_versions`; insertion order is mandatory.

## Insertion order (required)

1. **Insert `listings`** — without `current_version_id`.
2. **Insert `listing_versions`** — with `listing_id` pointing to the new listing.
3. **Update `listings`** — set `current_version_id` to the new version's id.

Never set both foreign keys in one step. Use this three-step sequence (preferably in a transaction).

## Tables involved

- **`listings`**: Main record — id, slug, title, has_vault, developer_entity_name, developer_ca_name, created_at, updated_at; `current_version_id` is set in step 3.
- **`listing_versions`**: Versioned payload — id, listing_id, version_number, data (JSONB), created_at, published_at, news_links.
- **`admin_user_listings`**: Link admin users to listings after creation.

## Key constraints

- First version is always `version_number = 1`.
- `data` in `listing_versions` must be valid JSONB with the expected structure (title, description, location, projectDetails, financials, developer, images, status, hasVault).
- Slug must be unique.

## Example (minimal)

```sql
-- Step 1
INSERT INTO listings (id, slug, title, has_vault, developer_entity_name, developer_ca_name, created_at, updated_at)
VALUES ('listing-uuid', 'your-slug', 'Title', true, 'Entity', 'Contact', NOW(), NOW());

-- Step 2
INSERT INTO listing_versions (id, listing_id, version_number, data, created_at, published_at, news_links)
VALUES ('version-uuid', 'listing-uuid', 1, '{...}'::jsonb, NOW(), NOW(), ARRAY[]::jsonb[]);

-- Step 3
UPDATE listings SET current_version_id = 'version-uuid' WHERE slug = 'your-slug';
```

## After creating a listing

Associate admins:

```sql
INSERT INTO admin_user_listings (user_id, listing_slug) VALUES
  ((SELECT id FROM admin_users WHERE email = 'admin@example.com'), 'your-slug')
ON CONFLICT (user_id, listing_slug) DO NOTHING;
```

## Common pitfalls

- Wrong order: always listing → listing_version → update listing.
- Forgetting step 3 (current_version_id).
- Setting both FKs in one go (circular dependency).

## Reference

For full SQL examples, required field tables, testing query, and scripts, see **oz-dev-dash/docs/listing-insertion-guide.md**.

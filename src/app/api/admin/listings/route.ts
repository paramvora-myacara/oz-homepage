import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin/auth';
import { createAdminClient } from '@/utils/supabase/admin';
import { createListingGeneralFolder } from '@/utils/supabaseImages';

export async function POST(request: NextRequest) {
  console.log('POST /api/admin/listings called');
  try {
    // Verify admin authentication and role - use same pattern as other admin APIs
    console.log('Verifying admin authentication...');
    const user = await verifyAdmin();
    if (!user) {
      console.log('User not authenticated');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('User authenticated:', user.email, 'Role:', user.role);

    // Check if user has required role
    const isInternalAdmin = user.role === 'internal_admin';
    const isCustomer = user.role === 'customer';

    if (!isInternalAdmin && !isCustomer) {
      console.log('User does not have required role:', user.role);
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    console.log('User has required role:', user.role);

    const supabase = createAdminClient();

    const body = await request.json();
    const { slug, title, sections } = body;

    // Title and slug are always required
    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Slug and title are required' },
        { status: 400 }
      );
    }

    const isDraft = !sections || sections.trim() === '';

    // Validate that sections is valid JSON if provided
    let sectionsData = null;
    if (!isDraft) {
      try {
        sectionsData = JSON.parse(sections);
      } catch (e) {
        return NextResponse.json(
          { error: 'Sections must be valid JSON' },
          { status: 400 }
        );
      }
    }

    const listingId = crypto.randomUUID();

    // Create listing in database (Step 1 from insertion guide)
    console.log('Creating listing record...');
    const { data: listing, error: insertError } = await supabase
      .from('listings')
      .insert({
        id: listingId,
        slug,
        title,
        current_version_id: null, // Will be set after version creation if not draft
        has_vault: true, // Developers always start with a vault enabled
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create listing' },
        { status: 500 }
      );
    }
    console.log('Listing created:', listing.id);

    // If not a draft, proceed with version creation (Steps 2 & 3)
    if (!isDraft) {
      const versionId = crypto.randomUUID();

      // Create listing version (Step 2 from insertion guide)
      console.log('Creating listing version...');
      const { error: versionError } = await supabase
        .from('listing_versions')
        .insert({
          id: versionId,
          listing_id: listingId,
          version_number: 1,
          data: sectionsData,
          created_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
          news_links: []
        });

      if (versionError) {
        console.error('Version insert error:', versionError);
        // Clean up the listing if version creation fails
        await supabase.from('listings').delete().eq('id', listingId);
        return NextResponse.json(
          { error: 'Failed to create listing version' },
          { status: 500 }
        );
      }
      console.log('Listing version created:', versionId);

      // Update listing to reference current version (Step 3 from insertion guide)
      console.log('Updating listing with current version...');
      const { error: updateError } = await supabase
        .from('listings')
        .update({ current_version_id: versionId })
        .eq('id', listingId);

      if (updateError) {
        console.error('Listing update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to update listing with version' },
          { status: 500 }
        );
      }
      console.log('Listing updated with current version');
    } else {
      console.log('Skipping version creation for draft listing');
    }

    // Associate the admin user with the listing
    const { error: associationError } = await supabase
      .from('admin_user_listings')
      .insert({
        user_id: user.id,
        listing_slug: slug
      });

    if (associationError) {
      console.error('Association error:', associationError);
      // Don't fail the request for association errors, but log it
    }

    return NextResponse.json({
      success: true,
      listing: {
        id: listing.id,
        slug: listing.slug,
        title: listing.title,
        has_vault: listing.has_vault,
        is_draft: isDraft
      },
      message: isDraft ? 'Draft listing started successfully' : 'Listing created successfully',
      redirectTo: isDraft ? `/${slug}/access-dd-vault/edit` : null
    });

  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { notFound, redirect } from 'next/navigation';
import { getListingForViewer } from '@/lib/supabase/listings';
import { verifyAdminCanEditSlug } from '@/lib/admin/auth';
import ListingPageClient from '@/app/listings/[slug]/listing-page-client';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { EditModeProvider } from '@/components/editor/EditModeProvider';

interface EditPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { slug } = await params;

  // Check admin authorization
  const adminUser = await verifyAdminCanEditSlug(slug);
  if (!adminUser) {
    redirect('/dashboard/login');
  }

  // Viewer-aware so in_review drafts are reviewable in the editor (§7).
  const listing = await getListingForViewer(slug);

  if (!listing) {
    notFound();
  }

  return (
    <EditModeProvider listing={listing} slug={slug}>
      <div className="min-h-screen bg-gray-50">
        <EditorToolbar />
        <div className="pt-16">
          <ListingPageClient listing={listing} slug={slug} isEditMode={true} />
        </div>
      </div>
    </EditModeProvider>
  );
} 
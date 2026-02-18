import { promises as fs } from 'fs';
import path from 'path';
import { Listing, NewsCardMetadata } from '@/types/listing';

export async function getLocalListingBySlug(slug: string): Promise<Listing | null> {
    const jsonPath = path.join(process.cwd(), 'src/lib/listings', `${slug}.json`);

    try {
        const file = await fs.readFile(jsonPath, 'utf8');
        const data = JSON.parse(file);

        // Add default fields if they're missing since local JSON might not be 100% complete
        return {
            ...data,
            newsLinks: data.newsLinks || [],
            is_verified_oz_project: data.is_verified_oz_project || false,
            is_draft: data.is_draft || false,
        } as Listing;
    } catch (error) {
        console.error(`Error reading local listing ${slug}.json:`, error);
        return null;
    }
}

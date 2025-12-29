import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SocialProfile {
    platform: string;
    url: string;
    title?: string;
    snippet?: string;
    [key: string]: any;
}

const SUPPORTED_PLATFORMS = [
    'facebook.com',
    'instagram.com',
    'linkedin.com',
    'twitter.com',
    'x.com',
    'tiktok.com',
    'pinterest.com',
    'youtube.com'
];

/**
 * Helper to identify platform from URL
 */
const identifyPlatform = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();

        for (const platform of SUPPORTED_PLATFORMS) {
            if (hostname.includes(platform)) {
                return platform.split('.')[0].charAt(0).toUpperCase() + platform.split('.')[0].slice(1);
            }
        }
        return 'Other';
    } catch (error) {
        return null;
    }
};

export const searchSocialMedia = async (
    name: string,
    location?: string,
    email?: string,
    phone?: string,
    borrowerId?: string
): Promise<SocialProfile[]> => {
    try {
        const apiKey = process.env.SERPAPI_KEY;
        if (!apiKey) {
            throw new Error('SERPAPI_KEY is not configured in .env');
        }

        let query = `"${name}"`;
        if (location) query += ` "${location}"`;
        if (email) query += ` "${email}"`;
        if (phone) query += ` "${phone}"`;

        const bioSites = SUPPORTED_PLATFORMS.map(p => `site:${p}`).join(' OR ');
        query += ` (${bioSites})`;

        console.log(`[SocialSearch] Searching for: ${query}`);

        const response = await axios.get('https://serpapi.com/search.json', {
            params: {
                engine: 'google',
                q: query,
                api_key: apiKey,
                num: 15
            }
        });

        const results = response.data.organic_results || [];

        const profiles: SocialProfile[] = [];
        const seenUrls = new Set<string>();

        // Prepare data for DB insertion
        const dbRecords = [];

        for (const result of results) {
            const url = result.link;
            if (!url) continue;

            if (seenUrls.has(url)) continue;

            const platform = identifyPlatform(url);
            if (platform) {
                seenUrls.add(url);

                const profileObj: SocialProfile = {
                    ...result,
                    platform: platform === 'X' ? 'Twitter/X' : platform,
                    url: url,
                };

                profiles.push(profileObj);

                if (borrowerId) {
                    dbRecords.push({
                        borrowerId: borrowerId,
                        platform: profileObj.platform,
                        url: profileObj.url,
                        title: profileObj.title || '',
                        snippet: profileObj.snippet || '',
                        metadata: result // Store raw result as metadata
                    });
                }
            }
        }

        // Save to DB if borrowerId is present and records exist
        if (borrowerId && dbRecords.length > 0) {
            console.log(`[SocialSearch] Saving ${dbRecords.length} profiles for borrower ${borrowerId}`);
            await prisma.socialMediaProfile.createMany({
                data: dbRecords
            });
        }

        return profiles;

    } catch (error: any) {
        console.error('Error in searchSocialMedia:', error.message);
        throw new Error(`Social media search failed: ${error.message}`);
    }
};

import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { auditLogService } from "./auditLogService";

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
    borrowerId?: string,
    user?: any
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

            const actorId = user ? user.id : "SYSTEM";
            const actorName = user ? user.name : "SYSTEM";
            const actorRole = user ? user.role : undefined;

            await auditLogService.createLog({
                borrowerId: borrowerId,
                module: "SOCIAL_MEDIA",
                action: "CREATE",
                details: `Saved ${dbRecords.length} social media profiles`,
                status: "SUCCESS",
                actorId,
                actorName,
                actorRole,
            });
        }

        return profiles;

    } catch (error: any) {
        console.error('Error in searchSocialMedia:', error.message);
        throw new Error(`Social media search failed: ${error.message}`);
    }
};

/**
 * Get all social media profiles for borrowers assigned to a specific agent
 */
export const getSocialMediaByAgentId = async (agentId: string) => {
    try {
        // First verify the agent exists and get agent details
        const agent = await prisma.agent.findUnique({
            where: { id: agentId },
            include: {
                user: {
                    select: { name: true, email: true },
                },
            },
        });

        if (!agent) {
            throw new Error('Agent not found');
        }

        // Get all borrowers assigned to this agent with their social media profiles
        const borrowersWithSocial = await prisma.borrower.findMany({
            where: {
                assignments: {
                    some: {
                        agentId: agentId,
                    },
                },
            },
            include: {
                socialProfiles: true,
                assignments: {
                    where: {
                        agentId: agentId,
                    },
                },
            },
        });

        // Flatten the results to return all social media profiles with borrower and agent info
        const socialMediaProfiles = borrowersWithSocial.flatMap((borrower) =>
            borrower.socialProfiles.map((profile) => ({
                ...profile,
                borrower: {
                    id: borrower.id,
                    name: borrower.name,
                    email: borrower.email,
                    phone: borrower.phone,
                    address: borrower.address,
                },
                agent: {
                    id: agent.id,
                    name: agent.name,
                    email: agent.email,
                    userName: agent.user.name,
                },
            }))
        );

        return socialMediaProfiles;

    } catch (error: any) {
        console.error('Error in getSocialMediaByAgentId:', error.message);
        throw new Error(`Failed to fetch social media profiles: ${error.message}`);
    }
};

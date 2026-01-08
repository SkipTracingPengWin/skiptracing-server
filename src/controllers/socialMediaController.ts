import { Request, Response } from 'express';
import { searchSocialMedia } from '../services/socialMediaSearchService';

export const searchProfiles = async (req: Request, res: Response) => {
    try {
        const { name, location, email, phone, borrowerId } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Borrower name is required'
            });
        }

        const profiles = await searchSocialMedia(name, location, email, phone, borrowerId, req.user);

        res.status(200).json({
            success: true,
            count: profiles.length,
            data: profiles
        });

    } catch (error: any) {
        console.error('Controller Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during social media search'
        });
    }
};

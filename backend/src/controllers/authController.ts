import { Request, Response } from 'express';
import axios from 'axios';
import { User } from '../models';
import { generateToken } from '../middleware/auth';

const AIRTABLE_CLIENT_ID = process.env.AIRTABLE_CLIENT_ID!;
const AIRTABLE_CLIENT_SECRET = process.env.AIRTABLE_CLIENT_SECRET!;
const AIRTABLE_REDIRECT_URI = process.env.AIRTABLE_REDIRECT_URI!;
const AIRTABLE_AUTH_BASE_URL = process.env.AIRTABLE_AUTH_BASE_URL || 'https://airtable.com/oauth2/v1';

export const initiateOAuth = (req: Request, res: Response) => {
    const scope = 'data.records:read data.records:write schema.bases:read';
    const state = Math.random().toString(36).substring(7);

    const authUrl = `${AIRTABLE_AUTH_BASE_URL}/authorize?` +
        `client_id=${AIRTABLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(AIRTABLE_REDIRECT_URI)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scope)}&` +
        `state=${state}`;

    res.redirect(authUrl);
};

export const handleOAuthCallback = async (req: Request, res: Response) => {
    try {
        const { code, state } = req.query;

        if (!code) {
            return res.status(400).json({ error: 'Authorization code not provided' });
        }

        const tokenResponse = await axios.post(
            `${AIRTABLE_AUTH_BASE_URL}/token`,
            {
                grant_type: 'authorization_code',
                code,
                redirect_uri: AIRTABLE_REDIRECT_URI,
                client_id: AIRTABLE_CLIENT_ID,
                client_secret: AIRTABLE_CLIENT_SECRET
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const { access_token, refresh_token } = tokenResponse.data;


        const userInfoResponse = await axios.get('https://api.airtable.com/v0/meta/whoami', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        const { id: airtableUserId, email } = userInfoResponse.data;

        let user = await User.findOne({ airtableUserId });

        if (user) {
            user.accessToken = access_token;
            user.refreshToken = refresh_token;
            user.loginTimestamp = new Date();
            user.email = email;
            await user.save();
        } else {
            user = await User.create({
                airtableUserId,
                name: email.split('@')[0],
                email,
                accessToken: access_token,
                refreshToken: refresh_token,
                loginTimestamp: new Date()
            });
        }

        const token = generateToken(user._id.toString());

        res.json({
            success: true,
            message: 'Authentication successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error: any) {
        console.error('OAuth callback error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Authentication failed',
            details: error.response?.data || error.message
        });
    }
};

import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
    keyFilename: 'path/to/service-account-key.json', // Download from Google Cloud Console
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

export const getAccessToken = async () => {
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    return accessToken.token;
};
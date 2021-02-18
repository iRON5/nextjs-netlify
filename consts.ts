import { join } from 'path';

export const contentDir = join(process.cwd(), 'content');

export const githubOAuthConfig = {
  client: {
    id: process.env.OAUTH_CLIENT_ID || '',
    secret: process.env.OAUTH_CLIENT_SECRET || '',
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize',
  },
};

import { NextApiHandler } from 'next';
import { githubOAuthConfig } from 'consts';
import { AuthorizationCode } from 'simple-oauth2';

const renderBody = (
  status: string,
  token: string,
) => {
  return `
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:github:${status}:${JSON.stringify(token.replace('"', ''))}',
          message.origin
        );
        window.removeEventListener('message', receiveMessage, false);
      }
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    </script>
  `;
};

const callbackHandler: NextApiHandler = async (req, res) => {
  const { host } = req.headers;
  const url = new URL(`https://${host}/${req.url}`);
  const urlParams = url.searchParams;
  const code = urlParams.get('code') || '';
  const client = new AuthorizationCode(githubOAuthConfig);

  try {
    const accessToken = await client.getToken({
      code,
      redirect_uri: `https://${host}/api/callback`,
    });
    const token = accessToken.token['access_token'] as string;
    const responseBody = renderBody('success', token);

    res.statusCode = 200;
    res.end(responseBody);
  } catch (e) {
    res.statusCode = 200;
    res.end(renderBody('error', e));
  }
};

export default callbackHandler;

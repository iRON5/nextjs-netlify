import { NextApiHandler } from "next";
import { randomBytes } from "crypto";
import { AuthorizationCode } from "simple-oauth2";
import { githubOAuthConfig } from 'consts';

export const randomString = () => randomBytes(4).toString("hex");

const authHandler: NextApiHandler = async (req, res) => {
  const { host } = req.headers;
  const client = new AuthorizationCode(githubOAuthConfig);

  const authorizationUri = client.authorizeURL({
    redirect_uri: `https://${host}/api/callback`,
    scope: 'repo,user',
    state: randomString(),
  });

  res.writeHead(301, { Location: authorizationUri });
  res.end();
};

export default authHandler;

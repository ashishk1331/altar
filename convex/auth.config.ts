export default {
  providers: [
    {
      type: 'customJwt',
      issuer: 'https://accounts.google.com',
      jwks: 'https://www.googleapis.com/oauth2/v3/certs',
      algorithm: 'RS256',
      applicationID: process.env.GOOGLE_WEB_CLIENT_ID,
    },
  ],
};

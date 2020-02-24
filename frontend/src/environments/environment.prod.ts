export const environment = {
  production: true,
  baseUrl: "https://xm6pd9tj3g.execute-api.us-east-1.amazonaws.com/dev",
  auth0: {
    domain: "mowamed.auth0.com",
    client_id: "LGYoHVP8w9iFdgoAU166OlT2VpA8gDUj",
    redirect_uri: `${window.location.origin}`,
    audience: "http://finale-project-expense-manager.com",
    scope: "openid profile email read:users"
  }
};

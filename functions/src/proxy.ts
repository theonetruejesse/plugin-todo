// openai please get your shit together
// redirect workaround for addressing “Auth URL, Token URL and API hostname must share a root domain” issues
import { corsRequest } from "./utils/cors";

// get https://accounts.provider.com/o/oauth2/auth
export const proxyAuthUrl = corsRequest((_, res) => {
  res.redirect("https://accounts.provider.com/o/oauth2/auth");
});

// get https://accounts.provider.com/o/oauth2/auth
export const proxyTokenUrl = corsRequest((_, res) => {
  res.redirect("https://oauth2.provider.com/token");
});

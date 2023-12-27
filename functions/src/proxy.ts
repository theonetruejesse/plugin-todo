// openai please get your shit together
// redirect workaround for addressing “Auth URL, Token URL and API hostname must share a root domain” issues
import { onRequest } from "firebase-functions/v2/https";
import cors = require("cors");
const corsOptions = {
  origin: "https://chat.openai.com/.com/", // Allow only this origin to access your function
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Include cookies in cross-origin requests if necessary
};

// get https://accounts.provider.com/o/oauth2/auth
export const proxyAuthUrl = onRequest((req, res) => {
  cors(corsOptions)(req, res, () => {
    res.redirect("https://accounts.provider.com/o/oauth2/auth");
  });
});

// get https://accounts.provider.com/o/oauth2/auth
export const proxyTokenUrl = onRequest((req, res) => {
  cors(corsOptions)(req, res, () => {
    res.redirect("https://oauth2.provider.com/token");
  });
});

import { defineString } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";

import admin = require("firebase-admin");
admin.initializeApp();

// const functions = require("firebase-functions");
const { google } = require("googleapis");

const CLIENT_ID = defineString("CLIENT_ID");
const CLIENT_SECRET = defineString("CLIENT_SECRET");
const REDIRECT_URL = defineString("REDIRECT_URL");

// Google OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID.value(),
  CLIENT_SECRET.value(),
  REDIRECT_URL.value() // calls oauth2callback() on redirect
);

export const googleSignIn = onRequest((_, res) => {
  // Generate an authentication URL and redirect the user to Google's OAuth2 service
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/drive.appfolder"],
  });
  res.redirect(authUrl);
});

export const oauth2callback = onRequest(async (req, res) => {
  try {
    // Exchange the code for an access token and ID token
    const { tokens } = await oauth2Client.getToken(req.query.code);
    res.json({ access: tokens.access_token });
  } catch (error) {
    res.status(403).send("No code found");
  }
});

// exports.secureEndpoint = functions.https.onRequest(async (req, res) => {
//   const accessToken = req.headers.authorization;

//   if (!accessToken) {
//     return res.status(401).send("Access token required");
//   }

//   try {
//     const oauth2Client = new google.auth.OAuth2();
//     oauth2Client.setCredentials({ access_token: accessToken });
//     // Perform operations with oauth2Client
//     res.send("Secure data accessed");
//   } catch (error) {
//     res.status(403).send("Invalid or expired token");
//   }
// });

// firebase id token version
// need to add 'openid' into scopes for this to work
// export const oauth2callback = onRequest(async (req, res) => {
//   const oauth2Client = new google.auth.OAuth2(
//     CLIENT_ID.value(),
//     CLIENT_SECRET.value(),
//     REDIRECT_URL.value() // calls oauth2callback() on redirect
//   );

//   try {
//     // Exchange the code for an access token and ID token
//     const { tokens } = await oauth2Client.getToken(req.query.code);

//     // storeToken(tokens.access_token)

//     res.json({ access: tokens.access_token });

//     const ticket = await oauth2Client.verifyIdToken({
//       idToken: tokens.id_token,
//       audience: CLIENT_ID.value(),
//     });
//     const payload = ticket.getPayload();

//     // Create or get the Firebase user
//     // Store these tokens securely
//     const firebaseToken = await admin.auth().createCustomToken(payload.sub);

//     res.redirect("/some-success-page");
//   } catch (error) {
//     res.redirect("/some-error-page");
//   }
// });
// exports.refreshToken = functions.https.onRequest(async (req, res) => {
//   const oauth2Client = new google.auth.OAuth2(
//     CLIENT_ID.value(),
//     CLIENT_SECRET.value(),
//     REDIRECT_URL.value() // calls oauth2callback() on redirect
//   );

//   oauth2Client.setCredentials({
//     refresh_token: "YOUR_STORED_REFRESH_TOKEN",
//   });

//   try {
//     const newTokens = await oauth2Client.refreshAccessToken();
//     // Update stored tokens

//     storeToken(newTokens)

//     res.send("Token refreshed successfully.");
//   } catch (error) {
//     res.status(500).send("Failed to refresh token.");
//   }
// });

// exports.secureEndpoint = functions.https.onRequest(async (req, res) => {
//   const accessToken = req.headers.authorization;

//   if (!accessToken) {
//     return res.status(401).send("Access token required");
//   }

//   try {
//     const oauth2Client = new google.auth.OAuth2();
//     oauth2Client.setCredentials({ access_token: accessToken });
//     // Perform operations with oauth2Client
//     res.send("Secure data accessed");
//   } catch (error) {
//     res.status(403).send("Invalid or expired token");
//   }
// });

// export const googleSignIn = onRequest(async (req, res) => {
//     const CLIENT_ID = defineString("CLIENT_ID");
//     const CLIENT_SECRET = defineString("CLIENT_SECRET");
//     const REDIRECT_URL = defineString("REDIRECT_URL");

//     // Google OAuth2 configuration
//     const oauth2Client = new google.auth.OAuth2(
//       CLIENT_ID.value(), // YOUR_CLIENT_ID,
//       CLIENT_SECRET.value(),
//       REDIRECT_URL.value() // calls self (googleSignIn()) on redirect
//     );

//     if (!req.query.code) {
//       // Generate an authentication URL and redirect the user to Google's OAuth2 service
//       const authUrl = oauth2Client.generateAuthUrl({
//         access_type: "offline",
//         scope: ["https://www.googleapis.com/auth/drive.appfolder", "openid"], // openid required for getting id_token below
//       });
//       res.redirect(authUrl);
//     } else {
//       try {
//         // Exchange the code for an access token and ID token
//         // @ts-ignore
//         const { tokens } = await oauth2Client.getToken(req.query.code);
//         logger.log("tokens", tokens);
//         oauth2Client.setCredentials(tokens);

//         // Verify the ID token and get the Firebase user
//         const ticket = await oauth2Client.verifyIdToken({
//           idToken: tokens.id_token,
//           audience: CLIENT_ID.value(),
//         });
//         const payload = ticket.getPayload();

//         // Create or get the Firebase user
//         // @ts-ignore
//         const firebaseToken = await admin.auth().createCustomToken(payload.sub);

//         res.json({ firebaseToken });
//       } catch (error) {
//         logger.log("errors", error);
//         res.status(500).send("Authentication failed");
//       }
//     }
//   });

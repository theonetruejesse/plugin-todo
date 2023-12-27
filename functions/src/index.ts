import * as logger from "firebase-functions/logger";

import { onRequest } from "firebase-functions/v2/https";
// import { FieldValue, getFirestore } from "firebase-admin/firestore";

import { google } from "googleapis";
import { defineString } from "firebase-functions/params";

import admin = require("firebase-admin");
admin.initializeApp();

export const helloWorld = onRequest((req, res) => {
  logger.log("Hello console!");
  res.send("Hello from Firebase!");
});

import proxy = require("./proxy");
exports.proxyTokenUrl = proxy.proxyTokenUrl;
exports.proxyAuthUrl = proxy.proxyAuthUrl;

import compliance = require("./compliance");
exports.pluginLogo = compliance.pluginLogo;
exports.pluginManifest = compliance.pluginManifest;
exports.openapiSpec = compliance.openapiSpec;

import crud = require("./crud");
exports.addTodo = crud.addTodo;
exports.getTodos = crud.getTodos;
exports.deleteTodo = crud.deleteTodo;

export const googleSignIn = onRequest(async (req, res) => {
  const CLIENT_ID = defineString("CLIENT_ID");
  const CLIENT_SECRET = defineString("CLIENT_SECRET");
  const REDIRECT_URL = defineString("REDIRECT_URL");

  // Google OAuth2 configuration
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID.value(), // YOUR_CLIENT_ID,
    CLIENT_SECRET.value(),
    REDIRECT_URL.value() // calls self (googleSignIn()) on redirect
  );

  if (!req.query.code) {
    // Generate an authentication URL and redirect the user to Google's OAuth2 service
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/drive.appfolder", "openid"], // openid required for getting id_token below
    });
    res.redirect(authUrl);
  } else {
    try {
      // Exchange the code for an access token and ID token
      // @ts-ignore
      const { tokens } = await oauth2Client.getToken(req.query.code);
      logger.log("tokens", tokens);
      oauth2Client.setCredentials(tokens);

      // Verify the ID token and get the Firebase user
      const ticket = await oauth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: CLIENT_ID.value(),
      });
      const payload = ticket.getPayload();

      // Create or get the Firebase user
      // @ts-ignore
      const firebaseToken = await admin.auth().createCustomToken(payload.sub);

      res.json({ firebaseToken });
    } catch (error) {
      logger.log("errors", error);
      res.status(500).send("Authentication failed");
    }
  }
});

// export const authGetTodos = onRequest(async (req, res) => {
//   cors(corsOptions)(req, res, async () => {
//     if (req.method !== "GET") return res.status(405).send("Method Not Allowed");
//     const customToken = req.headers.authorization?.split("Bearer ")[1];
//     if (!customToken) return res.status(403).send("Unauthorized");

//     // await admin.auth().signInWithCustomToken(customToken);
//     // signInWithCustomToken();

//     // const data = (
//     //   await admin.firestore().collection("users").doc(uid).get()
//     // ).data();
//   });
// });

/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as logger from "firebase-functions/logger";
import axios from "axios";
import admin = require("firebase-admin");

import { onRequest } from "firebase-functions/v2/https";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

import { google } from "googleapis";

admin.initializeApp();

import cors = require("cors");
import { defineString } from "firebase-functions/params";
const corsOptions = {
  origin: "https://chat.openai.com/.com/", // Allow only this origin to access your function
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Include cookies in cross-origin requests if necessary
};

export const helloWorld = onRequest((req, res) => {
  cors(corsOptions)(req, res, () => {
    logger.log("Hello console!");
    res.send("Hello from Firebase!");
  });
});

export const addTodo = onRequest(async (req, res) => {
  cors(corsOptions)(req, res, async () => {
    if (req.method === "POST") {
      const username = req.body.username ?? "john doe";
      const todo = req.body.todo;

      await getFirestore()
        .collection("users")
        .doc(username)
        .update({
          todos: FieldValue.arrayUnion(todo),
        });

      res.status(200).send("OK");
    } else {
      res.status(405).send("Method Not Allowed");
    }
  });
});

// todo -> make idToken into a wrapper function
export const getTodos = onRequest(async (req, res) => {
  cors(corsOptions)(req, res, async () => {
    if (req.method !== "GET") return res.status(405).send("Method Not Allowed");
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) return res.status(403).send("Unauthorized");
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
      const data = (
        await admin.firestore().collection("users").doc(uid).get()
      ).data();
      const todos = data ? data["todos"] : [];
      return res.status(200).json(todos);
    } catch (error) {
      return res.status(403).send("Invalid token");
    }
  });
});

export const deleteTodo = onRequest((req, res) => {
  cors(corsOptions)(req, res, async () => {
    if (req.method === "DELETE") {
      const username = req.body.username;

      // delete all todos (CHANGE ME LMAOOOOOO)
      await getFirestore().collection("users").doc(username).update({
        todos: FieldValue.delete(),
      });

      res.status(200).send("OK");
    } else {
      res.status(405).send("Method Not Allowed");
    }
  });
});

export const pluginLogo = onRequest(async (_, res) => {
  try {
    const response = await axios.get("https://plugin-todo.web.app/logo.png", {
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", "image/png");
    res.send(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      res.status(404).send("File not found");
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

export const pluginManifest = onRequest(async (req, res) => {
  try {
    const response = await axios.get(
      "https://plugin-todo.web.app/.well-known/ai-plugin.json"
    );

    res.setHeader("Content-Type", "application/json");
    res.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      res.status(404).send("File not found");
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

export const openapiSpec = onRequest(async (req, res) => {
  try {
    const response = await axios.get(
      "https://plugin-todo.web.app/openapi.yaml",
      {
        responseType: "text",
      }
    );

    res.setHeader("Content-Type", "application/x-yaml");
    res.send(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      res.status(404).send("File not found");
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

export const googleSignIn = onRequest(async (req, res) => {
  const CLIENT_ID = defineString("CLIENT_ID");
  const CLIENT_SECRET = defineString("CLIENT_SECRET");
  const REDIRECT_URL = defineString("REDIRECT_URL");

  // Google OAuth2 configuration
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID.value(), // YOUR_CLIENT_ID,
    CLIENT_SECRET.value(),
    REDIRECT_URL.value() // calls self
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

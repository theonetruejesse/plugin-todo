import * as logger from "firebase-functions/logger";

import { onRequest } from "firebase-functions/v2/https";

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

import oauth = require("./oauth");
exports.googleSignIn = oauth.googleSignIn;
exports.oauth2callback = oauth.oauth2callback;

import drive = require("./drive");
exports.listDocs = drive.listDocs;

// export const authGetTodos = onRequest(async (req, res) => {
//   cors(corsOptions)(req, res, async () => {
//     if (req.method !== "GET") return res.status(405).send("Method Not Allowed");
//     const authToken = req.headers.authorization?.split("Bearer ")[1];
//     if (!authToken) return res.status(403).send("Unauthorized");

//     // await admin.auth().signInWithCustomToken(customToken);
//     // signInWithCustomToken();

//     // const data = (
//     //   await admin.firestore().collection("users").doc(uid).get()
//     // ).data();
//   });
// });

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

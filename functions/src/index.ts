import * as logger from "firebase-functions/logger";

import { onRequest } from "firebase-functions/v2/https";

import admin = require("firebase-admin");
admin.initializeApp();

export const helloWorld = onRequest((req, res) => {
  logger.log("Hello logger!");
  console.log("Hello console!");
  res.send("Hello from Firebase!");
});

import proxy = require("./proxy");
exports.proxyTokenUrl = proxy.proxyTokenUrl;
exports.proxyAuthUrl = proxy.proxyAuthUrl;

import drive = require("./drive");
exports.listDocs = drive.listDocs;

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

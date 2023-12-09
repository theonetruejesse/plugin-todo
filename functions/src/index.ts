/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import * as logger from "firebase-functions/logger";
import axios from "axios";
import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
initializeApp();

import cors = require("cors");
const corsOptions = {
  origin: "https://chat.openai.com/.com/", // Allow only this origin to access your function
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Include cookies in cross-origin requests if necessary
};

export const helloWorld = onRequest((req, res) => {
  cors(corsOptions)(req, res, () => {
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

export const getTodos = onRequest(async (req, res) => {
  cors(corsOptions)(req, res, async () => {
    if (req.method === "GET") {
      const username = req.query.username as string;
      const data = (
        await getFirestore().collection("users").doc(username).get()
      ).data();
      const todos = data ? data["todos"] : [];
      res.status(200).json(todos);
    } else {
      res.status(405).send("Method Not Allowed");
    }
  });
});

export const deleteTodo = onRequest((req, res) => {
  cors(corsOptions)(req, res, async () => {
    if (req.method === "DELETE") {
      const username = req.body.username;

      // delete all todos
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

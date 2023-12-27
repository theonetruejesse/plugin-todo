import axios from "axios";
import { onRequest } from "firebase-functions/v2/https";

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

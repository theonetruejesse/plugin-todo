import { logger } from "firebase-functions/v2";
import { corsRequest } from "./utils/cors";
import axios from "axios";

export const listDocs = corsRequest(async (_, res) => {
  const accessToken = "TOKEN";

  try {
    const response = await axios.get(
      "https://www.googleapis.com/drive/v3/files",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: "mimeType='application/vnd.google-apps.document'",
          pageSize: 10,
          fields: "files(id, name)",
        },
      }
    );

    // Process and return the list of documents
    res.send(response.data.files);
  } catch (error) {
    logger.log("error", error);
    res.status(405).send("Method Not Allowed");
  }
});

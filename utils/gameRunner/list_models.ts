import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({});

async function listModels() {
  try {
    const response: any = await genAI.models.list();
    console.log("Available Models:");
    // The response structure depends on the SDK version, let's try to log the entire response or iterate
    if (Array.isArray(response)) {
      response.forEach((m) => console.log(m.name));
    } else if (response.models) {
      response.models.forEach((m: any) => console.log(m.name));
    } else {
      console.log(JSON.stringify(response, null, 2));
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();

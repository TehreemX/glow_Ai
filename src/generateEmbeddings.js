import OpenAI from "openai";
import fs from "fs";
import { skincareData } from "./data/skincare_dataset.js"; // tumhara dataset

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // ya directly "YOUR_API_KEY"
});

const embeddings = [];

for (const text of skincareData) {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  embeddings.push({ text, embedding: res.data[0].embedding });
}

fs.writeFileSync("src/data/embeddings.json", JSON.stringify(embeddings));
console.log("✅ Embeddings created successfully!");

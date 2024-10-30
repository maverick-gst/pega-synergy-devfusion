import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";
import { ChatOllama } from "@langchain/ollama";


if (!process.env.GROQ_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in the environment variables");
}

export const gpt4Mini = new ChatOpenAI({
  modelName: "gpt-4o-mini-2024-07-18",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export const groqLLama3_2_3b = new ChatGroq({
  modelName: "llama-3.2-3b-preview",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,
});


export const groqLLama3_2_70b = new ChatGroq({
  modelName: "llama-3.1-8b-instant",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,
});




const OllamabaseURL = "https://api.trading-maverick.com";

// Generic function to create Ollama models
function createOllamaModel(modelName: string, useBaseUrl: boolean = true) {
  return new ChatOllama({
    model: modelName,
    ...(useBaseUrl && { baseUrl: OllamabaseURL }),
  });
}

// Create Ollama models
export const OllamaLlama3_2_8b = createOllamaModel("llama3", false);
export const OllamaGemma2b = createOllamaModel("gemma2:2b");
export const OllamaLLama_3_1_8b = createOllamaModel("llama3.1:8b");
export const OllamaPhi3_3_8b = createOllamaModel("phi3:3.8b");
export const OllamaMistral7b = createOllamaModel("mistral:7b");
export const OllamaMixtral8x7b = createOllamaModel("mixtral:8x7b");
export const OllamaGemma2_27b = createOllamaModel("gemma2:27b");
export const OllamaPhi3Latest = createOllamaModel("phi3:latest");
export const OllamaQwen4b = createOllamaModel("qwen:4b");
export const OllamaGemma2_9b = createOllamaModel("gemma2:9b");
export const OllamaMistralLatest = createOllamaModel("mistral:latest");
export const OllamaPhi3_5Latest = createOllamaModel("phi3.5:latest");
export const OllamaLlama3_1_70b = createOllamaModel("llama3.1:70b");
export const OllamaLlama3_2_3b = createOllamaModel("llama3.2:3b");
export const OllamaLlama3_2_1b = createOllamaModel("llama3.2:1b");
export const OllamaLlama2Uncensored = createOllamaModel("llama2-uncensored:latest");
export const OllamaLlama3_1Latest = createOllamaModel("llama3.1:latest");
export const OllamaLlama3_2Latest = createOllamaModel("llama3.2:latest");
export const OllamaLlavaLatest = createOllamaModel("llava:latest");
export const OllamaCodeGemma7b = createOllamaModel("codegemma:7b");
export const OllamaCodeGemmaLatest = createOllamaModel("codegemma:latest");

// ... any other existing code ...

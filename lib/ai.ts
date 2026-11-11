import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const exaone = createOpenAICompatible({
  name: "exaone",
  baseURL: "https://api.exaone.ai/v1",
  apiKey: process.env.EXAONE_API_KEY,
});

export const exaoneModel = exaone("k-exaone_v2.5");

export const SYSTEM_PROMPT = "너는 개발 공부를 돕는 도우미야. 한국어로 짧고 정확하게 답해.";

export const exaoneOptions = { exaone: { reasoningEffort: "low" } };

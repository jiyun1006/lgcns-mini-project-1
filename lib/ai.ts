const EXAONE_URL = "https://api.exaone.ai/v1/chat/completions";
const MODEL = "k-exaone_v2.5";
const TIMEOUT_MS = 30_000;

const SYSTEM_PROMPT = "너는 개발 공부를 돕는 도우미야. 한국어로 짧고 정확하게 답해.";

export type AiMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function askExaone(messages: AiMessage[]) {
  const res = await fetch(EXAONE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.EXAONE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      reasoning_effort: "low",
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`EXAONE 에러 ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const message = data.choices[0].message;

  return {
    content: (message.content as string).trim(),
    reasoning: (message.reasoning_content ?? null) as string | null,
  };
}

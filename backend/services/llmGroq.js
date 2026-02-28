import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function groqGenerate ({ system, user }) {
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      {role: "system", content: system},
      {role: "user", content: user}
    ]
  })
  return String(completion.choices?.[0]?.message?.content || "").trim();
};

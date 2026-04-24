import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { recentEntries } = await req.json();

    const context =
      recentEntries?.length > 0
        ? `Here are the user's recent journal entries:\n\n${recentEntries
            .slice(0, 3)
            .map((e: { date: string; content: string }) => `[${e.date}]\n${e.content}`)
            .join("\n\n")}`
        : "This person has just started journaling.";

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 120,
      system:
        "You are a thoughtful journaling coach. Generate a single, short, personal writing prompt (one sentence, max 12 words) based on the user's recent entries. Make it specific and reflective, not generic. Return only the prompt — no quotes, no preamble.",
      messages: [{ role: "user", content: context }],
    });

    const prompt =
      response.content[0].type === "text" ? response.content[0].text.trim() : null;

    return NextResponse.json({ prompt });
  } catch {
    return NextResponse.json({ prompt: null }, { status: 500 });
  }
}

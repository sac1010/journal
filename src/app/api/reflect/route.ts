import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { content, date } = await req.json();

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 220,
      system:
        "You are a gentle, empathetic journaling companion. Read the user's journal entry and respond with a warm, thoughtful reflection — 2-3 sentences. Notice something specific from what they wrote. Ask one open-ended follow-up question at the end. Be human, not therapist-like. No bullet points, no headers.",
      messages: [
        {
          role: "user",
          content: `Entry from ${date}:\n\n${content}`,
        },
      ],
    });

    const reflection =
      response.content[0].type === "text" ? response.content[0].text.trim() : null;

    return NextResponse.json({ reflection });
  } catch {
    return NextResponse.json({ reflection: null }, { status: 500 });
  }
}

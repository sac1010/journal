import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { entries } = await req.json();

    if (!entries || entries.length === 0) {
      return NextResponse.json({ summary: "No entries found for this week." });
    }

    const entryText = entries
      .map((e: { date: string; content: string }) => `[${e.date}]\n${e.content}`)
      .join("\n\n---\n\n");

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 350,
      system:
        "You are a thoughtful journaling companion. Read the user's entries from the past week and write a warm, personal weekly summary. Cover: the main themes or feelings that came up, anything that shifted or evolved across the entries, and one encouraging observation. Keep it to 3-4 short paragraphs. Write in second person (you/your). Be specific — reference actual things they wrote.",
      messages: [
        {
          role: "user",
          content: `Here are my journal entries from the past week:\n\n${entryText}`,
        },
      ],
    });

    const summary =
      response.content[0].type === "text" ? response.content[0].text.trim() : null;

    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json({ summary: null }, { status: 500 });
  }
}

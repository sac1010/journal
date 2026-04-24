import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { question, entries } = await req.json();

    if (!entries || entries.length === 0) {
      return NextResponse.json({
        answer: "You haven't written any journal entries yet.",
      });
    }

    const entryText = entries
      .map((e: { date: string; content: string }) => `[${e.date}]\n${e.content}`)
      .join("\n\n---\n\n");

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      system: [
        {
          type: "text",
          text: "You are a thoughtful assistant that helps users understand patterns and insights from their personal journal. Answer questions about the journal entries honestly and specifically — always reference actual things they wrote. Keep answers concise (2-4 sentences). If the entries don't contain enough information to answer, say so plainly.",
          cache_control: { type: "ephemeral" },
        },
        {
          type: "text",
          text: `Here are all the user's journal entries:\n\n${entryText}`,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: question }],
    });

    const answer =
      response.content[0].type === "text" ? response.content[0].text.trim() : null;

    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json({ answer: null }, { status: 500 });
  }
}

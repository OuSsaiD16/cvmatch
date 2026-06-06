import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cv, matched_keywords, missing_keywords } = await request.json();

  if (!cv?.trim()) {
    return NextResponse.json({ error: "CV text is required" }, { status: 400 });
  }

  const keywords = [...(matched_keywords ?? []), ...(missing_keywords ?? [])].join(", ");
  const cvExcerpt = cv.slice(0, 1500);

  const prompt = `You are a career advisor specializing in the Algerian and international remote job market.

Based on the CV excerpt and skills below, suggest 5 specific, realistic job opportunities.

Return ONLY a valid JSON array with exactly 5 objects (no markdown, no explanation):
[
  {
    "title": "Specific Job Title",
    "company_type": "Type of company hiring for this role (e.g. Algerian fintech startup, French remote-first SaaS, Gulf-based multinational)",
    "why_it_matches": "1-2 sentences explaining why this candidate is a strong fit based on their specific skills",
    "search_query": "LinkedIn or Indeed search query to find this role (e.g. \\"React developer\\" Algeria OR remote)"
  }
]

Rules:
- Mix of roles in Algeria (Algiers, Oran, remote-friendly local companies) AND fully remote international positions
- Be specific about the job title — not generic like "Developer" but "Frontend React Developer" or "Data Analyst – Fintech"
- Match the candidate's actual experience level and skills realistically
- search_query must be ready to paste directly into LinkedIn Jobs or Indeed search

Skills / keywords: ${keywords || "not provided"}

CV excerpt:
${cvExcerpt}`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected AI response" }, { status: 500 });
    }

    let jobs;
    try {
      const cleaned = content.text.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
      jobs = JSON.parse(cleaned);
      if (!Array.isArray(jobs)) throw new Error("Not an array");
    } catch {
      return NextResponse.json({ error: "Failed to parse job suggestions" }, { status: 500 });
    }

    return NextResponse.json({ jobs });
  } catch (err) {
    console.error("Find jobs error:", err);
    return NextResponse.json({ error: "Failed to generate job suggestions" }, { status: 500 });
  }
}

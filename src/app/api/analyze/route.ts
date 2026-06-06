import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

const anthropic = new Anthropic();

const FREE_ANALYSES = 2;

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get or create usage record
  const serviceClient = createServiceClient();
  let { data: usage, error: usageError } = await serviceClient
    .from("users_usage")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (usageError && usageError.code === "PGRST116") {
    // Row doesn't exist, create it
    const { data: newUsage, error: insertError } = await serviceClient
      .from("users_usage")
      .insert({ user_id: user.id, analysis_count: 0, is_pro: false })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to insert users_usage row:", insertError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
    usage = newUsage;
  } else if (usageError) {
    console.error("Failed to fetch users_usage row:", usageError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // Check paywall
  if (!usage!.is_pro && usage!.analysis_count >= FREE_ANALYSES) {
    return NextResponse.json({ error: "PAYWALL" }, { status: 402 });
  }

  const { cv, jobDescription } = await request.json();

  if (!cv?.trim() || !jobDescription?.trim()) {
    return NextResponse.json({ error: "CV and job description are required" }, { status: 400 });
  }

  const prompt = `You are an expert career coach and ATS (Applicant Tracking System) specialist. Analyze the following CV against the job description.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "score": <number 0-100>,
  "matched_keywords": [<array of strings>],
  "missing_keywords": [<array of strings>],
  "rewritten_summary": "<improved CV summary paragraph incorporating the missing keywords naturally>",
  "tip": "<one specific, actionable improvement tip>"
}

Rules:
- score: overall match percentage based on skills, experience, keywords alignment
- matched_keywords: important terms/skills present in both CV and job description (max 15)
- missing_keywords: important terms/skills from job description not in CV (max 15)
- rewritten_summary: rewrite only the professional summary/objective section of the CV to better target this role
- tip: one concrete, specific thing the candidate can do to improve their application

CV:
${cv}

Job Description:
${jobDescription}`;

  try {
    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const message = await stream.finalMessage();
    const content = message.content[0];

    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response from AI" }, { status: 500 });
    }

    let analysis;
    try {
      // Strip any accidental markdown code fences
      const cleaned = content.text.replace(/^```json?\n?/, "").replace(/\n?```$/, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    // Increment usage count
    await serviceClient
      .from("users_usage")
      .update({ analysis_count: usage!.analysis_count + 1 })
      .eq("user_id", user.id);

    return NextResponse.json({
      analysis,
      remaining: usage!.is_pro ? null : Math.max(0, FREE_ANALYSES - usage!.analysis_count - 1),
      is_pro: usage!.is_pro,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

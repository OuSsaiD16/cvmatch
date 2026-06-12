// ============================================
// DAILY CONTENT ENGINE — AI Money & Tech Facts
// Target: Europe audience (EN) | TikTok + YT Shorts
// ============================================

const https = require("https");
const fs = require("fs");
const path = require("path");

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

// ── TOPICS POOL ──────────────────────────────
const TOPICS = [
  "tools making people rich with AI in 2026",
  "how Europeans earn €500/month passively with AI",
  "AI replaced these 5 jobs this month",
  "this free AI tool saves 10 hours a week",
  "how to make money while you sleep using AI",
  "shocking AI statistics Europeans don't know",
  "this AI side hustle earns €2000/month",
  "AI tools banks use that you can access for free",
  "5 AI facts that will change how you work",
  "the AI skill that pays €50/hour in Europe",
  "this man automated his entire income with AI",
  "why 80% of Europeans will use AI by 2027",
  "AI tools that pay you to use them",
  "how to turn €0 into €500 with AI this month",
  "the AI secret big companies don't want you to know",
];

// ── CALL CLAUDE API ───────────────────────────
async function callClaude(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const options = {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.content[0].text);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── GENERATE FULL CONTENT PACKAGE ─────────────
async function generateContentPackage(topic) {
  console.log(`\n🎬 Generating content for: "${topic}"\n`);

  const prompt = `You are a viral TikTok/YouTube Shorts scriptwriter targeting European audiences (18-35 yo).
Create a complete content package for this topic: "${topic}"

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "title": "video title under 60 chars, curiosity-driven",
  "hook": "first 3 seconds spoken text — MUST be shocking or surprising, max 15 words",
  "script": [
    {"line": "spoken text here", "duration": 3},
    {"line": "spoken text here", "duration": 4}
  ],
  "total_duration": 45,
  "captions": ["caption line 1", "caption line 2", "caption line 3"],
  "hashtags": "#ai #money #europe #tech #passiveincome #aitools #makemoney #sidehustle #financialfreedom #artificialintelligence",
  "tiktok_caption": "full TikTok caption under 150 chars with 1 emoji and call to action",
  "youtube_title": "YouTube Shorts title optimized for search",
  "youtube_description": "3 line YouTube description with keywords",
  "shots": [
    {"shot_number": 1, "duration": 3, "visual": "exact description of what to show in CapCut", "text_overlay": "text on screen", "pexels_search": "keyword for Pexels video search"}
  ],
  "voiceover_full": "complete script as one block of text ready to paste into ElevenLabs — natural, fast-paced, European English accent friendly",
  "elevenlabs_settings": {
    "voice": "Adam",
    "stability": 0.4,
    "similarity_boost": 0.8,
    "style": 0.6,
    "speaking_rate": 1.15
  },
  "capcut_instructions": "step by step CapCut mobile instructions to assemble this video in under 15 minutes",
  "thumbnail_text": "3-5 word bold text for thumbnail",
  "best_post_time": "best time to post for European audience (CET timezone)"
}

Rules:
- Script must be 40-55 seconds total when spoken at 1.15x speed
- Hook must create FOMO or shock
- Use specific numbers (€ amounts, percentages, timeframes)
- Shots must be achievable with free Pexels footage
- CapCut instructions must be beginner-friendly
- All content in English`;

  const raw = await callClaude(prompt);

  // Clean and parse JSON
  let jsonStr = raw.trim();
  if (jsonStr.includes("```")) {
    jsonStr = jsonStr.replace(/```json|```/g, "").trim();
  }

  let content;
  try {
    content = JSON.parse(jsonStr);
  } catch (e) {
    // Try to extract JSON from response
    const match = jsonStr.match(/\{[\s\S]*\}/);
    if (match) content = JSON.parse(match[0]);
    else throw new Error("Failed to parse JSON from Claude response");
  }

  return content;
}

// ── FORMAT OUTPUT ─────────────────────────────
function formatOutput(content, topic) {
  const date = new Date().toISOString().split("T")[0];
  const filename = `${date}_${topic.replace(/\s+/g, "_").substring(0, 30)}`;

  let output = "";
  output += `${"=".repeat(60)}\n`;
  output += `🎬 CONTENT PACKAGE — ${date}\n`;
  output += `📌 Topic: ${topic}\n`;
  output += `${"=".repeat(60)}\n\n`;

  output += `📱 TITLES\n`;
  output += `${"─".repeat(40)}\n`;
  output += `TikTok Title : ${content.title}\n`;
  output += `YouTube Title: ${content.youtube_title}\n`;
  output += `Thumbnail    : ${content.thumbnail_text}\n`;
  output += `Post Time    : ${content.best_post_time}\n\n`;

  output += `🎙️ VOICEOVER — PASTE INTO ELEVENLABS\n`;
  output += `${"─".repeat(40)}\n`;
  output += `${content.voiceover_full}\n\n`;

  output += `⚙️ ELEVENLABS SETTINGS\n`;
  output += `${"─".repeat(40)}\n`;
  output += `Voice    : ${content.elevenlabs_settings.voice}\n`;
  output += `Stability: ${content.elevenlabs_settings.stability}\n`;
  output += `Style    : ${content.elevenlabs_settings.style}\n`;
  output += `Speed    : ${content.elevenlabs_settings.speaking_rate}x\n\n`;

  output += `🎬 SHOT LIST FOR CAPCUT\n`;
  output += `${"─".repeat(40)}\n`;
  content.shots.forEach((shot) => {
    output += `Shot ${shot.shot_number} (${shot.duration}s)\n`;
    output += `  Visual      : ${shot.visual}\n`;
    output += `  Text Overlay: ${shot.text_overlay}\n`;
    output += `  Pexels Search: "${shot.pexels_search}"\n\n`;
  });

  output += `📱 CAPCUT INSTRUCTIONS\n`;
  output += `${"─".repeat(40)}\n`;
  output += `${content.capcut_instructions}\n\n`;

  output += `📣 CAPTIONS & HASHTAGS\n`;
  output += `${"─".repeat(40)}\n`;
  output += `TikTok Caption:\n${content.tiktok_caption}\n\n`;
  output += `YouTube Description:\n${content.youtube_description}\n\n`;
  output += `Hashtags:\n${content.hashtags}\n\n`;

  output += `${"=".repeat(60)}\n`;
  output += `✅ Package ready — estimated CapCut time: 15 min\n`;
  output += `${"=".repeat(60)}\n`;

  return { output, filename };
}

// ── MAIN ──────────────────────────────────────
async function main() {
  // Pick topic: random or from arg
  const topicArg = process.argv[2];
  const topic = topicArg
    ? TOPICS.find((t) => t.includes(topicArg)) || topicArg
    : TOPICS[Math.floor(Math.random() * TOPICS.length)];

  try {
    const content = await generateContentPackage(topic);
    const { output, filename } = formatOutput(content, topic);

    // Save to file
    const outPath = path.join(__dirname, "output", `${filename}.txt`);
    fs.writeFileSync(outPath, output, "utf8");

    // Also save raw JSON for future use
    const jsonPath = path.join(__dirname, "output", `${filename}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2), "utf8");

    console.log(output);
    console.log(`\n💾 Saved to: output/${filename}.txt`);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main();

import { NextResponse } from "next/server";
import { getTopMatches } from "@/lib/retrieval";

export const dynamic = 'force-dynamic';

export const maxDuration = 60; // Allow Vercel hobby plan to wait longer for AI API

async function embedQuery(text: string, apiKey: string): Promise<number[]> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/gemini-embedding-2",
        content: { parts: [{ text }] },
      }),
    }
  );
  if (!res.ok) {
    throw new Error(`Embedding request failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  return data.embedding.values;
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const hasCloudflare = !!(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN);
    const hasGemini = !!process.env.GEMINI_API_KEY;

    if (!hasGemini && !hasCloudflare) {
      return NextResponse.json(
        { error: "No AI provider configured (missing Cloudflare or Gemini keys)." },
        { status: 500 }
      );
    }

    // Retrieve the most relevant persona knowledge for the latest user message
    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === "user")?.content ?? "";
    let retrievedContext = "";
    if (process.env.GEMINI_API_KEY) {
      try {
        const queryEmbedding = await embedQuery(lastUserMessage, process.env.GEMINI_API_KEY);
        const matches = getTopMatches(queryEmbedding, 5);
        retrievedContext = matches
          .map((m) => `- ${m.text}`)
          .join("\n");
      } catch (err) {
        console.error("Retrieval step failed, falling back to base persona only:", err);
      }
    }

    const systemPrompt = `You are the AI Clone of Suyash Singh, speaking on his behalf in his interactive 3D portfolio.
Your goal is to answer questions about Suyash's background, skills, work experience, projects, and goals, behaving exactly like him.

About Suyash:
- Personality: A friendly, enthusiastic creative developer who is passionate about merging robust full-stack engineering with beautiful interactive WebGL/Three.js visuals.
- Tone of Voice: Chill, tech-savvy, conversational, helpful, and concise. Never write huge, dry walls of text. Be approachable and polite. Use lower-case styling or casual sentences occasionally, but keep it readable and highly professional.
- Education: B.Tech in Computer Science & Engineering (Cloud Computing specialization) at Bennett University (Class of 2024-2028), holding a stellar CGPA of 8.98/10. Key courses include Data Structures, Analysis of Algorithms, Design of Cloud Architectural Solutions, React, and DBMS.
- Work Experience:
  * Software Development & Research Analytics Intern at IIT Kanpur (June 2026 - August 2026): Re-engineered DoRA giveaway portal with React.js, built real-time analytical dashboards using JS/Fetch API for live CSR tracking, co-authored 7 infrastructure-focused project proposals.
  * Project Intern at SAIL Bokaro Steel Plant (July 2026 - August 2026): Designed and deployed an NLP-based incident classification model under the CGM to categorize plant safety hazards in real time. Built an automated reporting and audit dashboard to replace manual incident-sorting workflows across departments.
  * President of CodeChef Bennett University Chapter (August 2025 - May 2026): Led and organized 10+ coding contests/events with 1000+ cumulative participants, managed core team operations and sponsorships.
- Key Projects (When asked about projects, you MUST mention all of these):
  * VoteSamvidhan: A secure blockchain-backed election integrity and digital voting platform with constitutional literacy.
  * SkySentinel: A space situational awareness platform monitoring satellite collision risks in Earth's orbit with real-time TLE 3D visualization. Built with React, TypeScript, Tailwind CSS, CesiumJS, Three.js, and Flask.
  * Tribe: A student campus event discovery, organization, and club planning system with AI recommendations.
  * Pram Engine: A custom project engine providing VCR-style aesthetics and functionality.
- Technical Skills:
  * Languages: Python, C++, SQL, HTML, CSS.
  * Frontend: React.js, Three.js, Responsive UI Design, Next.js, Tailwind CSS, TypeScript.
  * Cloud: AWS (S3, Lambda, DynamoDB, SQS, Cognito, Elastic Beanstalk, API Gateway, CloudWatch).
  * Backend & Databases: REST APIs, MySQL, DBMS, Spring Boot (Basics).
  * Tools: Git, GitHub, IntelliJ IDEA, VS Code.
- Contact/Links:
  * Email: suyashsingh667@gmail.com
  * Mobile: +91-9580235002
  * LinkedIn: Suyash Singh (https://www.linkedin.com/in/suyashsingh0435)
  * GitHub: https://github.com/SuyashSingh667
  * Portfolio: http://localhost:3001
- Achievements:
  * CGPA 8.98 / 10 (top performer)
  * Selected as President of CodeChef Bennett University Chapter
  * Volunteered as Event Organizer at Zenevia and Tech Supervisor at Hackaccino

${retrievedContext ? `Relevant personal knowledge for this specific question (use this to answer accurately and in your own voice — don't just repeat it verbatim, blend it naturally into a first-person answer):\n${retrievedContext}\n` : ""}

Rule of Response:
1. Speak in the first person ("I", "my", "me") as if you are Suyash.
2. Keep responses brief (1-3 sentences or bullet points) so they fit nicely in a speech bubble or chat log.
3. If asked about something completely unrelated to you (e.g., cooking recipes, history trivia), answer very briefly or playfully, then pivot back to your portfolio or skills (e.g. "Paris! But speaking of travel, I'm focusing my journey on WebGL right now. Want to check out SkySentinel?").
4. Never break character.`;

    let response;

    if (process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN) {
      // Use Cloudflare Workers AI (Generous free tier: 10,000 requests/day)
      const cfMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m: any) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content
        }))
      ];
      
      response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`
          },
          body: JSON.stringify({
            messages: cfMessages,
            stream: true,
            max_tokens: 1000,
            temperature: 0.7
          })
        }
      );
    } else {
      // Format messages history for Gemini API
      // Gemini roles: "user" and "model"
      const contents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            generationConfig: {
              maxOutputTokens: 1000,
              temperature: 0.7,
            },
          }),
        }
      );
    }

    if (!response.ok) {
      const errText = await response.text();
      const provider = hasCloudflare ? "Cloudflare" : "Gemini";
      console.error(`${provider} API Error Response:`, errText);
      return NextResponse.json(
        { error: `Failed to fetch response from ${provider} API`, details: errText },
        { status: response.status }
      );
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error: any) {
    console.error("Chat API Route Error:", error);
    return NextResponse.json({ error: "Internal server error", message: error.message }, { status: 500 });
  }
}

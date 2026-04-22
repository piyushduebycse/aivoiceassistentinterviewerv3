import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

const corsHeaders = {
    "Access-Control-Allow-Origin":
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://ai-voice-agent-interview-platform-two.vercel.app",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-vercel-protection-bypass",
};

export async function GET() {
    return new Response(JSON.stringify({ success: true, message: "API is working" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
    });
}

export async function OPTIONS() {
    return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
    let body: any;
    try {
        body = await request.json();
    } catch {
        body = {};
    }

    const {
        type = "Technical",
        role = "Frontend Developer",
        level = "Junior",
        techstack = "React, JavaScript",
        amount = 5,
        userId = "vapi-user-" + Date.now(),
    } = body;

    console.log("Generating interview:", { type, role, level, techstack, amount, userId });

    try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "user",
                        content: `Generate exactly ${amount} interview questions for a ${level} ${role} position.
The tech stack is: ${techstack}.
Focus: ${type} questions.
Return ONLY a JSON array of strings. No explanation, no markdown, no extra text.
Example: ["Question 1", "Question 2", "Question 3"]`,
                    },
                ],
                temperature: 0.7,
            }),
        });

        if (!groqRes.ok) {
            const err = await groqRes.text();
            throw new Error(`Groq API error ${groqRes.status}: ${err}`);
        }

        const groqData = await groqRes.json();
        const raw = groqData.choices?.[0]?.message?.content ?? "";
        console.log("Groq raw response:", raw);

        const match = raw.match(/\[[\s\S]*\]/);
        if (!match) throw new Error("No JSON array in Groq response: " + raw);

        const questions = JSON.parse(match[0]);

        const interview = {
            role,
            type,
            level,
            techstack: techstack.split(",").map((t: string) => t.trim()),
            questions,
            userId,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        };

        const docRef = await db.collection("interviews").add(interview);

        return new Response(JSON.stringify({ success: true, interviewId: docRef.id }), {
            headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    } catch (error) {
        console.error("❌ Generate error:", error);
        return new Response(
            JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
    }
}

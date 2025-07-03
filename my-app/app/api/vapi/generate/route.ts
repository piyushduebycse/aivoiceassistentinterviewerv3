import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

// CORS headers helper
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-vercel-protection-bypass",
};


// GET Route
export async function GET() {
    return new Response(JSON.stringify({
        success: true,
        message: "API is working",
        timestamp: new Date().toISOString()
    }), {
        headers: {
            "Content-Type": "application/json",
            ...corsHeaders
        }
    });
}

// OPTIONS Route (Preflight CORS)
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: corsHeaders
    });
}

// POST Route
export async function POST(request: Request) {
    console.log("POST Request Started");
    console.log("Headers:", Object.fromEntries(request.headers.entries()));
    console.log("Protection header:", request.headers.get("x-vercel-protection-bypass"));

    try {
        const body = await request.json();
        const { type, role, level, techstack, amount } = body;

        const missingFields = [];
        if (!type) missingFields.push("type");
        if (!role) missingFields.push("role");
        if (!level) missingFields.push("level");
        if (!techstack) missingFields.push("techstack");
        if (!amount) missingFields.push("amount");

        if (missingFields.length > 0) {
            return new Response(JSON.stringify({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`,
                received: body
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders
                }
            });
        }

        const { text: questions } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Return as ["Question 1", "Question 2", ...]
      `,
        });

        const interview = {
            role,
            type,
            level,
            techstack: techstack.split(","),
            questions: JSON.parse(questions),
            userId: "vapi-user-" + Date.now(),
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        };

        await db.collection("interviews").add(interview);

        return new Response(JSON.stringify({
            success: true,
            message: "Interview generated successfully"
        }), {
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders
            }
        });
    }
}

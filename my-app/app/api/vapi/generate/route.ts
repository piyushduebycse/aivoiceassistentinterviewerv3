import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function GET() {
    console.log("GET request received");
    return Response.json({
        success: true,
        message: "API is working",
        timestamp: new Date().toISOString()
    });
}

export async function POST(request: Request) {
    console.log(" POST Request Started");
    console.log("Headers:", Object.fromEntries(request.headers.entries()));

    try {
        // Read the request body
        const body = await request.json();
        console.log(" Request Body:", JSON.stringify(body, null, 2));

        const { type, role, level, techstack, amount } = body;

        console.log(" Extracted Values:", { type, role, level, techstack, amount });

        // Check for missing fields
        const missingFields = [];
        if (!type) missingFields.push('type');
        if (!role) missingFields.push('role');
        if (!level) missingFields.push('level');
        if (!techstack) missingFields.push('techstack');
        if (!amount) missingFields.push('amount');

        if (missingFields.length > 0) {
            console.log(" Missing Fields:", missingFields);
            return Response.json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`,
                received: body
            }, { status: 400 });
        }

        console.log("All fields present, generating questions...");

        const { text: questions } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `Prepare questions for a job interview.
                The job role is ${role}.
                The job experience level is ${level}.
                The tech stack used in the job is: ${techstack}.
                The focus between behavioural and technical questions should lean towards: ${type}.
                The amount of questions required is: ${amount}.
                Please return only the questions, without any additional text.
                The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
                Return the questions formatted like this:
                ["Question 1", "Question 2", "Question 3"]
                
                Thank you! <3
            `,
        });

        console.log("Generated Questions:", questions);

        const interview = {
            role: role,
            type: type,
            level: level,
            techstack: techstack.split(","),
            questions: JSON.parse(questions),
            userId: "vapi-user-" + Date.now(),
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString()
        }

        await db.collection("interviews").add(interview);
        console.log(" Interview saved to database");

        return Response.json({
            success: true,
            message: "Interview generated successfully",
        });

    } catch (error) {
        console.error(" Error:", error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
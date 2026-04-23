import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    let fileName = "resume.pdf";

    try {
        const formData = await req.formData();
        const file = formData.get("resume") as File | null;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file provided." }, { status: 400 });
        }

        fileName = file.name;

        // Step 1: Extract text from PDF
        const buffer = Buffer.from(await file.arrayBuffer());
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse");
        const pdfData = await pdfParse(buffer);
        const resumeText = pdfData.text?.trim();

        if (!resumeText) {
            return NextResponse.json({
                success: false,
                error: "Could not extract text from this PDF. Make sure it is not a scanned image.",
            }, { status: 422 });
        }

        // Step 2: Call Groq API
        const prompt = `You are an expert resume reviewer and career coach. Analyze the following resume thoroughly and provide detailed, actionable feedback.

Resume Content:
${resumeText}

Return ONLY a valid JSON object (no markdown, no explanation) in this exact format:
{
  "overallScore": <number 0-100>,
  "sectionScores": [
    { "name": "Contact Information", "score": <0-100>, "comment": "<specific feedback>" },
    { "name": "Professional Summary", "score": <0-100>, "comment": "<specific feedback>" },
    { "name": "Work Experience", "score": <0-100>, "comment": "<specific feedback>" },
    { "name": "Skills Section", "score": <0-100>, "comment": "<specific feedback>" },
    { "name": "Education", "score": <0-100>, "comment": "<specific feedback>" },
    { "name": "Formatting & Readability", "score": <0-100>, "comment": "<specific feedback>" }
  ],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "criticalFixes": ["<critical fix 1>", "<critical fix 2>", "<critical fix 3>"],
  "suggestedImprovements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "atsScore": <number 0-100>,
  "atsIssues": ["<ats issue 1>", "<ats issue 2>", "<ats issue 3>"],
  "finalVerdict": "<2-3 sentence overall assessment of the resume>"
}`;

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3,
                response_format: { type: "json_object" },
            }),
        });

        if (!groqRes.ok) {
            const body = await groqRes.text();
            console.error("Groq error:", groqRes.status, body);
            return NextResponse.json({
                success: false,
                error: `Groq API error ${groqRes.status}: ${body}`,
            }, { status: 502 });
        }

        // Step 3: Parse Groq response
        const groqData = await groqRes.json();
        const raw = groqData.choices?.[0]?.message?.content ?? "{}";

        let analysis;
        try {
            analysis = JSON.parse(raw);
        } catch {
            console.error("JSON parse failed. Raw:", raw);
            return NextResponse.json({
                success: false,
                error: "AI returned an invalid response. Please try again.",
            }, { status: 502 });
        }

        return NextResponse.json({ success: true, analysis, fileName });

    } catch (error) {
        console.error("Resume route error:", error);
        return NextResponse.json({
            success: false,
            error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
        }, { status: 500 });
    }
}

"use server";

import { db } from "@/firebase/admin";

export async function createFeedback(params: CreateFeedbackParams) {
    const { interviewId, userId, transcript, feedbackId } = params;

    try {
        const formattedTranscript = transcript
            .map((s: { role: string; content: string }) => `${s.role}: ${s.content}`)
            .join("\n");

        const prompt = `You are an expert interview coach analyzing a mock job interview transcript.

Transcript:
${formattedTranscript}

Evaluate the candidate and return ONLY a valid JSON object (no markdown, no explanation) in this exact format:
{
  "totalScore": <number 0-100>,
  "categoryScores": [
    { "name": "Communication Skills", "score": <0-100>, "comment": "<specific feedback>" },
    { "name": "Technical Knowledge", "score": <0-100>, "comment": "<specific feedback>" },
    { "name": "Problem Solving", "score": <0-100>, "comment": "<specific feedback>" },
    { "name": "Cultural Fit", "score": <0-100>, "comment": "<specific feedback>" },
    { "name": "Confidence and Clarity", "score": <0-100>, "comment": "<specific feedback>" }
  ],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "areasForImprovement": ["<area 1>", "<area 2>", "<area 3>"],
  "finalAssessment": "<2-3 sentence overall summary of the candidate's performance>"
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
                temperature: 0.4,
                response_format: { type: "json_object" },
            }),
        });

        if (!groqRes.ok) {
            throw new Error(`Groq API error: ${groqRes.status}`);
        }

        const groqData = await groqRes.json();
        const raw = groqData.choices?.[0]?.message?.content ?? "{}";
        const object = JSON.parse(raw);

        const feedback = {
            interviewId,
            userId,
            totalScore: object.totalScore ?? 0,
            categoryScores: object.categoryScores ?? [],
            strengths: object.strengths ?? [],
            areasForImprovement: object.areasForImprovement ?? [],
            finalAssessment: object.finalAssessment ?? "",
            createdAt: new Date().toISOString(),
        };

        let feedbackRef;
        if (feedbackId) {
            feedbackRef = db.collection("feedback").doc(feedbackId);
        } else {
            feedbackRef = db.collection("feedback").doc();
        }

        await feedbackRef.set(feedback);
        return { success: true, feedbackId: feedbackRef.id };
    } catch (error) {
        console.error("Error saving feedback:", error);
        return { success: false };
    }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
    const interview = await db.collection("interviews").doc(id).get();

    return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
    params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
    const { interviewId, userId } = params;

    const querySnapshot = await db
        .collection("feedback")
        .where("interviewId", "==", interviewId)
        .where("userId", "==", userId)
        .limit(1)
        .get();

    if (querySnapshot.empty) return null;

    const feedbackDoc = querySnapshot.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
    params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
    const { userId, limit = 20 } = params;

    const interviews = await db
        .collection("interviews")
        .where("finalized", "==", true)
        .orderBy("createdAt", "desc")
        .limit(limit + 10)
        .get();

    return interviews.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Interview))
        .filter((interview) => interview.userId !== userId)
        .slice(0, limit);
}

export async function getInterviewsByUserId(
    userId: string
): Promise<Interview[] | null> {
    const interviews = await db
        .collection("interviews")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Interview[];
}


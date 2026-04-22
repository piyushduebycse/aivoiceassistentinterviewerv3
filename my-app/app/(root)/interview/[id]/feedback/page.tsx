import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";

const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
};

const scoreBarColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
};

const Feedback = async ({ params }: RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    const interview = await getInterviewById(id);
    if (!interview) redirect("/");

    const feedback = await getFeedbackByInterviewId({ interviewId: id, userId: user.id! });
    if (!feedback) redirect("/");

    const totalScore = feedback.totalScore ?? 0;

    return (
        <section className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-16">

            {/* Header */}
            <div className="flex flex-col gap-2 text-center">
                <h1 className="text-3xl font-bold capitalize">{interview.role} Interview Report</h1>
                <p className="text-gray-400 text-sm">
                    {dayjs(feedback.createdAt).format("MMMM D, YYYY · h:mm A")}
                </p>
            </div>

            {/* Overall Score */}
            <div className="card flex flex-col items-center gap-4 py-10">
                <p className="text-gray-400 text-sm uppercase tracking-widest">Overall Score</p>
                <div className={`text-7xl font-bold ${scoreColor(totalScore)}`}>
                    {totalScore}<span className="text-3xl text-gray-500">/100</span>
                </div>
                <p className="text-gray-300 text-center max-w-2xl leading-relaxed">
                    {feedback.finalAssessment}
                </p>
            </div>

            {/* Category Breakdown */}
            <div className="card flex flex-col gap-6 p-8">
                <h2 className="text-xl font-semibold">Performance Breakdown</h2>
                <div className="flex flex-col gap-5">
                    {feedback.categoryScores?.map((cat: any, i: number) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-sm">{cat.name}</span>
                                <span className={`font-bold text-sm ${scoreColor(cat.score)}`}>
                                    {cat.score}/100
                                </span>
                            </div>
                            <div className="w-full bg-dark-300 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${scoreBarColor(cat.score)}`}
                                    style={{ width: `${cat.score}%` }}
                                />
                            </div>
                            <p className="text-gray-400 text-sm">{cat.comment}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="flex flex-row gap-4 max-sm:flex-col">

                {/* Strengths */}
                <div className="card flex flex-col gap-4 p-6 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-green-400 text-xl">✓</span>
                        <h3 className="font-semibold text-green-400">What You Did Well</h3>
                    </div>
                    <ul className="flex flex-col gap-3">
                        {feedback.strengths?.map((s: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                <span className="text-green-500 mt-0.5 shrink-0">•</span>
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="card flex flex-col gap-4 p-6 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-xl">↑</span>
                        <h3 className="font-semibold text-yellow-400">Areas to Improve</h3>
                    </div>
                    <ul className="flex flex-col gap-3">
                        {feedback.areasForImprovement?.map((a: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                <span className="text-yellow-500 mt-0.5 shrink-0">•</span>
                                {a}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row gap-4 max-sm:flex-col">
                <Button className="btn-secondary flex-1">
                    <Link href="/" className="flex w-full justify-center">
                        <p className="text-sm font-semibold text-primary-200">Back to Dashboard</p>
                    </Link>
                </Button>
                <Button className="btn-primary flex-1">
                    <Link href={`/interview/${id}`} className="flex w-full justify-center">
                        <p className="text-sm font-semibold text-black">Retake Interview</p>
                    </Link>
                </Button>
            </div>
        </section>
    );
};

export default Feedback;

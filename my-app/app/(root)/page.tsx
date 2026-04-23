import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import {dummyInterviews} from "@/constants";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {getInterviewsByUserId,getLatestInterviews,} from "@/lib/actions/general.action";

async function Home() {
    const user = await getCurrentUser();

    const [userInterviews, allInterview] = await Promise.all([
        getInterviewsByUserId(user?.id!),
        getLatestInterviews({ userId: user?.id! }),
    ]);

    const hasPastInterviews = userInterviews?.length! > 0;
    const hasUpcomingInterviews = allInterview?.length! > 0;

    return (
        <>
            <section className="card-cta">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2>Get Interview-Ready with Voice-Powered AI Interview Practice</h2>
                    <p className="text-lg">
                        Practice real interview questions & get instant feedback
                    </p>

                    <Button asChild className="btn-primary max-sm:w-full">
                        <Link href="/interview">Start an Interview</Link>
                    </Button>
                </div>

                <Image
                    src="/robot.png"
                    alt="robot picture"
                    width={400}
                    height={400}
                    className="max-sm:hidden"
                />
            </section>

            <section className="card-border mt-8">
                <div className="card flex flex-row px-16 py-8 items-center justify-between max-sm:px-6 max-sm:flex-col max-sm:gap-6">
                    <div className="flex flex-col gap-6 max-w-lg">
                        <h2 className="font-bold">Boost Your Chances with an AI Resume Review</h2>
                        <p className="text-lg">
                            Get your resume scored, ATS-checked, and improved with instant AI feedback
                        </p>
                        <Button asChild className="btn-primary max-sm:w-full">
                            <Link href="/resume-review" className="font-bold">Review Your Resume</Link>
                        </Button>
                    </div>
                    <FileText size={110} className="text-primary-200 opacity-40 max-sm:hidden shrink-0" />
                </div>
            </section>

            <section className="flex flex-col gap-6 mt-8">
                <h2>Your Interviews</h2>

                <div className="interviews-section">
                    {hasPastInterviews ? (
                        userInterviews?.map((interview) => (
                            <InterviewCard
                                key={interview.id}
                                userId={user?.id}
                                interviewId={interview.id}
                                role={interview.role}
                                type={interview.type}
                                techstack={interview.techstack}
                                createdAt={interview.createdAt}
                            />
                        ))
                    ) : (
                        <p>You haven&apos;t taken any interviews yet</p>
                    )}
                </div>
            </section>



            <section className="flex flex-col gap-6 mt-8">
                <h2>Take Interviews</h2>

                <div className="interviews-section">
                    {hasUpcomingInterviews ? (
                        allInterview?.map((interview) => (
                            <InterviewCard
                                key={interview.id}
                                userId={user?.id}
                                interviewId={interview.id}
                                role={interview.role}
                                type={interview.type}
                                techstack={interview.techstack}
                                createdAt={interview.createdAt}
                            />
                        ))
                    ) : (
                        <p>There are no interviews available</p>
                    )}
                </div>
            </section>
        </>
    );
}

export default Home;
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import {dummyInterviews} from "@/constants";

const Page = () => {
    return (
        <>
            <section className="card-cta flex flex-col gap-6 max-w-lg">
                <h2>Get Interview Ready with AI-Powered Practice and Feedback</h2>
                <p className="text-lg">
                    Practice real interviews and get instant feedback.
                </p>

                <Button asChild className="btn-primary max-sm:w-full">
                    <Link href="/interview">Start an Interview</Link>
                </Button>
            </section>

            <Image
                src="/robot.png"
                alt="Robot logo"
                width={400}
                height={400}
                className="max-sm:hidden"
            />

            <section className="flex flex-col gap-6 mt-8">
                <h2>Your Interviews</h2>
                <div className="interviews-section">

                    {dummyInterviews.map((interview) => (
                        <InterviewCard {...interview} key={interview.id} />
                    ))}
                </div>
            </section>

            <section className="flex flex-col gap-6 mt-8">
                <h2>Take an Interview</h2>
                <div className="interviews-section">
                    {dummyInterviews.map((interview) => (
                        <InterviewCard {...interview} key={interview.id}/>
                    ))}

                </div>
            </section>
        </>
    );
};

export default Page;

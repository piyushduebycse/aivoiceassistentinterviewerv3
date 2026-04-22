import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import InterviewSetupForm from "@/components/InterviewSetupForm";

export default async function InterviewSetupPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    return (
        <div className="flex flex-col items-center gap-8 max-w-2xl mx-auto w-full">
            <div className="flex flex-col gap-2 text-center">
                <h2>Set Up Your Interview</h2>
                <p className="text-gray-400">Fill in the details and the AI interviewer will ask you the questions live.</p>
            </div>
            <InterviewSetupForm userId={user.id} />
        </div>
    );
}

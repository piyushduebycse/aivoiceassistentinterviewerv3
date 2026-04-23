import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import ResumeReview from "@/components/ResumeReview";

const ResumeReviewPage = async () => {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    return <ResumeReview />;
};

export default ResumeReviewPage;

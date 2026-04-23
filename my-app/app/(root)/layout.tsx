
import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FileText } from 'lucide-react';
import {isAuthenticated} from "@/lib/actions/auth.action";
import {redirect} from "next/navigation";


const RootLayout = async({ children }: { children: ReactNode }) => {
    const isUserAuthenticated=await isAuthenticated();
    if (!isUserAuthenticated) redirect('/sign-in');

    return (
        <div className="root-layout">
            <nav className="p-4 flex items-center justify-between border-b">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="logo" width={38} height={32} />
                    <h2 className="text-primary-100 text-xl font-semibold">VoiceHire</h2>
                </Link>
                <Link
                    href="/resume-review"
                    className="flex items-center gap-2 text-sm font-bold bg-primary-200 text-dark-100 hover:bg-primary-200/80 transition-colors duration-150 rounded-full px-4 py-2"
                >
                    <FileText size={15} />
                    <span>Resume Review</span>
                </Link>
            </nav>

            <main className="p-6 flex justify-center">
                <div className="w-full max-w-3xl">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default RootLayout;

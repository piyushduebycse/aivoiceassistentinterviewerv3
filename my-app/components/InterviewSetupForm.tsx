"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const roles = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "DevOps Engineer", "Mobile Developer", "UI/UX Designer", "Product Manager"];
const levels = ["Junior", "Mid-level", "Senior"];
const types = ["Technical", "Behavioural", "Mixed"];
const amounts = [3, 5, 7, 10];

export default function InterviewSetupForm({ userId }: { userId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        role: "",
        level: "Junior",
        techstack: "",
        type: "Technical",
        amount: 5,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.role.trim() || !form.techstack.trim()) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/vapi/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, userId }),
            });

            const data = await res.json();

            if (!data.success || !data.interviewId) {
                toast.error("Failed to generate interview. Please try again.");
                return;
            }

            toast.success("Interview created! Starting now...");
            router.push(`/interview/${data.interviewId}`);
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card w-full flex flex-col gap-6 p-8">
            <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Job Role</label>
                <input
                    name="role"
                    list="roles-list"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer"
                    className="w-full bg-dark-200 border border-dark-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-200"
                    required
                />
                <datalist id="roles-list">
                    {roles.map((r) => <option key={r} value={r} />)}
                </datalist>
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-medium text-sm">Tech Stack</label>
                <input
                    name="techstack"
                    value={form.techstack}
                    onChange={handleChange}
                    placeholder="e.g. React, Node.js, TypeScript"
                    className="w-full bg-dark-200 border border-dark-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-200"
                    required
                />
            </div>

            <div className="flex flex-row gap-4 max-sm:flex-col">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="font-medium text-sm">Experience Level</label>
                    <select
                        name="level"
                        value={form.level}
                        onChange={handleChange}
                        className="w-full bg-dark-200 border border-dark-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-200"
                    >
                        {levels.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    <label className="font-medium text-sm">Interview Type</label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="w-full bg-dark-200 border border-dark-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-200"
                    >
                        {types.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    <label className="font-medium text-sm">No. of Questions</label>
                    <select
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        className="w-full bg-dark-200 border border-dark-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-200"
                    >
                        {amounts.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 rounded-lg font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? "Generating Interview..." : "Start Interview"}
            </button>
        </form>
    );
}

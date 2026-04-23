"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, FileText, AlertCircle, CheckCircle, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

interface SectionScore {
    name: string;
    score: number;
    comment: string;
}

interface ResumeAnalysis {
    overallScore: number;
    sectionScores: SectionScore[];
    strengths: string[];
    criticalFixes: string[];
    suggestedImprovements: string[];
    atsScore: number;
    atsIssues: string[];
    finalVerdict: string;
}

interface AnalysisResult {
    success: boolean;
    analysis?: ResumeAnalysis;
    fileName?: string;
    error?: string;
}

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

const WHAT_WE_ANALYZE = [
    "Contact Information",
    "Professional Summary",
    "Work Experience",
    "Skills Section",
    "Education",
    "ATS Compatibility",
    "Formatting & Readability",
    "Keyword Optimization",
];

const ResumeReview = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateAndSetFile = (file: File) => {
        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be under 5MB.");
            return;
        }
        setSelectedFile(file);
        setResult(null);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) validateAndSetFile(file);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) validateAndSetFile(file);
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append("resume", selectedFile);
        setIsLoading(true);
        try {
            const res = await fetch("/api/resume/analyze", { method: "POST", body: formData });
            const data = await res.json();
            setResult(data as AnalysisResult);
        } catch {
            setResult({ success: false, error: "Network error. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setResult(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[420px]">
                <div className="card-border w-full max-w-md">
                    <div className="card flex flex-col items-center gap-6 py-16 px-8 text-center">
                        <div className="flex gap-2 items-center">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="size-3 rounded-full bg-primary-200 animate-bounce"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-primary-100">Analyzing Your Resume</h3>
                            <p className="text-sm text-gray-400">
                                Our AI is reviewing your resume in detail...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (result) {
        if (!result.success || !result.analysis) {
            return (
                <div className="flex flex-col items-center gap-6">
                    <div className="card-border w-full">
                        <div className="card flex flex-col items-center gap-4 py-12 px-8 text-center">
                            <AlertCircle size={48} className="text-red-400" />
                            <h3 className="text-red-400">Analysis Failed</h3>
                            <p className="text-gray-400">
                                {result.error ?? "Something went wrong. Please try again."}
                            </p>
                            <Button className="btn-primary mt-2" onClick={handleReset}>
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        const { analysis, fileName } = result;

        return (
            <section className="flex flex-col gap-8 w-full pb-16">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-3xl font-bold">Resume Analysis Report</h1>
                    <p className="text-gray-400 text-sm">
                        {fileName} · Analyzed {dayjs().format("MMMM D, YYYY · h:mm A")}
                    </p>
                </div>

                <div className="card flex flex-col items-center gap-4 py-10 px-8">
                    <p className="text-gray-400 text-sm uppercase tracking-widest">Overall Score</p>
                    <div className={`text-7xl font-bold ${scoreColor(analysis.overallScore)}`}>
                        {analysis.overallScore}
                        <span className="text-3xl text-gray-500">/100</span>
                    </div>
                    <p className="text-gray-300 text-center max-w-2xl leading-relaxed">
                        {analysis.finalVerdict}
                    </p>
                </div>

                <div className="card flex flex-col gap-4 p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Zap size={20} className="text-primary-200" />
                            <h2 className="text-xl font-semibold">ATS Compatibility</h2>
                        </div>
                        <span className={`text-2xl font-bold ${scoreColor(analysis.atsScore)}`}>
                            {analysis.atsScore}/100
                        </span>
                    </div>
                    <div className="w-full bg-dark-300 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all ${scoreBarColor(analysis.atsScore)}`}
                            style={{ width: `${analysis.atsScore}%` }}
                        />
                    </div>
                    {analysis.atsIssues?.length > 0 && (
                        <ul className="flex flex-col gap-2 mt-2">
                            {analysis.atsIssues.map((issue, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <span className="text-yellow-500 mt-0.5 shrink-0">•</span>
                                    {issue}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="card flex flex-col gap-6 p-8">
                    <h2 className="text-xl font-semibold">Section Breakdown</h2>
                    <div className="flex flex-col gap-5">
                        {analysis.sectionScores?.map((section, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-sm">{section.name}</span>
                                    <span className={`font-bold text-sm ${scoreColor(section.score)}`}>
                                        {section.score}/100
                                    </span>
                                </div>
                                <div className="w-full bg-dark-300 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all ${scoreBarColor(section.score)}`}
                                        style={{ width: `${section.score}%` }}
                                    />
                                </div>
                                <p className="text-gray-400 text-sm">{section.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-row gap-4 max-sm:flex-col">
                    <div className="card flex flex-col gap-4 p-6 flex-1">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18} className="text-green-400" />
                            <h3 className="font-semibold text-green-400">Strengths</h3>
                        </div>
                        <ul className="flex flex-col gap-3">
                            {analysis.strengths?.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <span className="text-green-500 mt-0.5 shrink-0">•</span>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="card flex flex-col gap-4 p-6 flex-1">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={18} className="text-red-400" />
                            <h3 className="font-semibold text-red-400">Critical Fixes</h3>
                        </div>
                        <ul className="flex flex-col gap-3">
                            {analysis.criticalFixes?.map((fix, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <span className="text-red-500 mt-0.5 shrink-0">•</span>
                                    {fix}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="card flex flex-col gap-4 p-6">
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-xl">↑</span>
                        <h3 className="font-semibold text-yellow-400">Suggested Improvements</h3>
                    </div>
                    <ul className="flex flex-col gap-3">
                        {analysis.suggestedImprovements?.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                <span className="text-yellow-500 mt-0.5 shrink-0">•</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-row gap-4 max-sm:flex-col">
                    <Button className="btn-secondary flex-1" onClick={handleReset}>
                        <p className="text-sm font-semibold text-primary-200">Analyze Another Resume</p>
                    </Button>
                    <Button asChild className="btn-primary flex-1">
                        <Link href="/">
                            <p className="text-sm font-semibold text-black">Back to Dashboard</p>
                        </Link>
                    </Button>
                </div>
            </section>
        );
    }

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Resume Review</h1>
                <p className="text-gray-400">
                    Upload your resume and get instant AI-powered feedback with actionable improvements.
                </p>
            </div>

            <div className="card-border">
                <div
                    className={cn(
                        "card flex flex-col items-center gap-6 py-16 px-8 text-center cursor-pointer transition-all duration-200",
                        isDragging && "ring-2 ring-primary-200 ring-inset"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !selectedFile && fileInputRef.current?.click()}
                >
                    {selectedFile ? (
                        <>
                            <div className="flex items-center justify-center size-20 rounded-full bg-dark-200 border border-primary-200/30">
                                <FileText size={36} className="text-primary-200" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="font-semibold text-white text-lg">{selectedFile.name}</p>
                                <p className="text-gray-400 text-sm">
                                    {(selectedFile.size / 1024).toFixed(1)} KB · PDF
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button className="btn-primary" onClick={handleAnalyze}>
                                    Analyze Resume
                                </Button>
                                <Button
                                    className="btn-secondary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleReset();
                                    }}
                                >
                                    Remove
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className={cn(
                                    "flex items-center justify-center size-20 rounded-full border-2 border-dashed transition-colors duration-200",
                                    isDragging
                                        ? "border-primary-200 bg-primary-200/10"
                                        : "border-light-600 bg-dark-200"
                                )}
                            >
                                <Upload
                                    size={36}
                                    className={isDragging ? "text-primary-200" : "text-light-400"}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-primary-100">Drop your resume here</h3>
                                <p className="text-gray-400 text-sm">or click to browse files</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <FileText size={14} />
                                <span>PDF only · Max 5MB</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
            />

            <div className="card flex flex-col gap-4 p-6">
                <h3 className="font-semibold text-primary-100">What We Analyze</h3>
                <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                    {WHAT_WE_ANALYZE.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                            <span className="text-primary-200 shrink-0">✓</span>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResumeReview;

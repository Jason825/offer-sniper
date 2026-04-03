"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ResumeUploader from "@/components/ResumeUploader";
import JobDescForm from "@/components/JobDescForm";
import { createClient } from "@/lib/supabase/client";
import { Resume, JobDescription } from "@/lib/types";

export default function UploadPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [jobDesc, setJobDesc] = useState<JobDescription | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email });
      } else {
        router.push("/auth/login");
      }
    });
  }, []);

  const handleGenerate = async () => {
    if (!resume || !jobDesc || !user) {
      setError("请先上传简历和职位描述");
      return;
    }

    setGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: resume.id,
          jobDescId: jobDesc.id,
          userId: user.id,
          resumeContent: resume.content,
          jobTitle: jobDesc.title,
          jobCompany: jobDesc.company,
          jobDescription: jobDesc.content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "生成失败");
      }

      const data = await response.json();
      router.push(`/interview/${data.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    }
    setGenerating(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">创建面试练习</h1>

        {error && (
          <div className="mb-6 p-4 text-sm text-destructive bg-destructive/10 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <ResumeUploader
              userId={user.id}
              onUploadComplete={setResume}
            />
          </div>
          <div>
            <JobDescForm
              userId={user.id}
              onSubmit={setJobDesc}
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleGenerate}
            disabled={!resume || !jobDesc || generating}
            className="px-12 py-4 bg-primary text-primary-foreground rounded-lg font-medium text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <span>AI 正在生成面试题...</span>
            ) : (
              <span>生成面试题目</span>
            )}
          </button>
          {(!resume || !jobDesc) && (
            <p className="mt-2 text-sm text-muted-foreground">
              请先上传简历和职位描述
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

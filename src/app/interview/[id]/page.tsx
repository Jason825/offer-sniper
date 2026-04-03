"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import QuestionList from "@/components/QuestionList";
import { createClient } from "@/lib/supabase/client";
import { Question, InterviewSession } from "@/lib/types";

export default function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Fetch session
    const { data: sessionData, error: sessionError } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (sessionError || !sessionData) {
      router.push("/dashboard");
      return;
    }
    setSession(sessionData);

    // Fetch questions
    const { data: questionsData } = await supabase
      .from("questions")
      .select("*")
      .eq("session_id", id)
      .order("order_index", { ascending: true });

    if (questionsData) {
      setQuestions(questionsData);
    }
    setLoading(false);
  };

  const handleToggleFavorite = async (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const newValue = !question.is_favorited;

    await supabase
      .from("questions")
      .update({ is_favorited: newValue })
      .eq("id", questionId);

    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, is_favorited: newValue } : q
      )
    );
  };

  const handleToggleMastered = async (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const newValue = !question.is_mastered;

    await supabase
      .from("questions")
      .update({ is_mastered: newValue })
      .eq("id", questionId);

    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, is_mastered: newValue } : q
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            ← 返回控制台
          </button>
          <h1 className="text-3xl font-bold">{session?.title}</h1>
          <p className="text-muted-foreground mt-2">
            共 {questions.length} 道面试题
          </p>
        </div>

        <QuestionList
          questions={questions}
          onToggleFavorite={handleToggleFavorite}
          onToggleMastered={handleToggleMastered}
          onUpdate={() => {}}
        />
      </main>
    </div>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateQuestions } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      resumeId,
      jobDescId,
      userId,
      resumeContent,
      jobTitle,
      jobCompany,
      jobDescription,
    } = body;

    if (!resumeContent || !jobDescription) {
      return NextResponse.json(
        { error: "缺少简历内容或职位描述" },
        { status: 400 }
      );
    }

    // Get user's MiniMax API key from settings
    const supabase = await createClient();
    const { data: settingsData } = await supabase
      .from("user_settings")
      .select("minimax_api_key")
      .eq("user_id", userId)
      .single();

    const apiKey = settingsData?.minimax_api_key || process.env.MINIMAX_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "未配置 MiniMax API Key，请前往设置页面配置" },
        { status: 400 }
      );
    }

    // Generate questions using MiniMax API
    const questions = await generateQuestions(
      {
        resumeContent,
        jobTitle,
        jobCompany,
        jobDescription,
      },
      apiKey
    );

    // Create session
    const sessionTitle = `${jobCompany} - ${jobTitle}`;
    const { data: session, error: sessionError } = await supabase
      .from("interview_sessions")
      .insert({
        user_id: userId,
        resume_id: resumeId,
        job_desc_id: jobDescId,
        title: sessionTitle,
        question_count: questions.length,
      })
      .select()
      .single();

    if (sessionError) {
      throw sessionError;
    }

    // Insert questions with session_id
    const questionsWithSessionId = questions.map((q) => ({
      ...q,
      session_id: session.id,
    }));

    const { error: questionsError } = await supabase
      .from("questions")
      .insert(questionsWithSessionId);

    if (questionsError) {
      throw questionsError;
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "生成失败" },
      { status: 500 }
    );
  }
}

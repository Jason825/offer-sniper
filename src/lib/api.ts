import { Question } from "./types";

interface GenerateQuestionsRequest {
  resumeContent: string;
  jobTitle: string;
  jobCompany: string;
  jobDescription: string;
}

interface MiniMaxResponse {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

export async function generateQuestions(
  data: GenerateQuestionsRequest,
  apiKey: string
): Promise<Question[]> {
  const prompt = `你是一个专业的面试教练。根据以下简历和职位描述，生成20-30道面试问题和答案。

简历内容：
${data.resumeContent}

目标职位：${data.jobTitle}
目标公司：${data.jobCompany}
职位描述：
${data.jobDescription}

请生成面试问题，问题应该涵盖：
1. 技术问题（与职位技能相关）
2. 行为问题（考察个人素质）
3. 职位相关问题（考察对岗位的理解）
4. 公司相关问题（考察对公司的了解）

请以JSON格式返回，格式如下：
{
  "questions": [
    {
      "question": "问题内容",
      "answer": "参考答案",
      "category": "技术/行为/公司/职位",
      "difficulty": "简单/中等/困难"
    }
  ]
}

只返回JSON，不要有其他文字。`;

  const response = await fetch("https://api.minimax.chat/v1/text/chatcompletion_pro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "MiniMax-Text-01",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`MiniMax API error: ${response.status}`);
  }

  const result: MiniMaxResponse = await response.json();
  const content = result.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No content in API response");
  }

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse JSON from response");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  const questions = parsed.questions as Array<{
    question: string;
    answer: string;
    category: string;
    difficulty: string;
  }>;

  return questions.map((q, index) => ({
    id: crypto.randomUUID(),
    session_id: "",
    question: q.question,
    answer: q.answer,
    category: q.category as Question["category"],
    difficulty: q.difficulty as Question["difficulty"],
    is_favorited: false,
    is_mastered: false,
    order_index: index,
    created_at: new Date().toISOString(),
  }));
}

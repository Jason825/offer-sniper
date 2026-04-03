export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  content: string;
  created_at: string;
}

export interface JobDescription {
  id: string;
  user_id: string;
  title: string;
  company: string;
  content: string;
  created_at: string;
}

export interface InterviewSession {
  id: string;
  user_id: string;
  resume_id: string;
  job_desc_id: string;
  title: string;
  question_count: number;
  created_at: string;
}

export interface Question {
  id: string;
  session_id: string;
  question: string;
  answer: string;
  category: "技术" | "行为" | "公司" | "职位";
  difficulty: "简单" | "中等" | "困难";
  is_favorited: boolean;
  is_mastered: boolean;
  order_index: number;
  created_at: string;
}

export interface UserSettings {
  minimax_api_key?: string;
}

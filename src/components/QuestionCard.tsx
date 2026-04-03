"use client";

import { useState } from "react";
import { Question } from "@/lib/types";
import { Star, Check, Eye, EyeOff } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  index: number;
  onToggleFavorite: (id: string) => void;
  onToggleMastered: (id: string) => void;
  onUpdate: (question: Question) => void;
}

export default function QuestionCard({
  question,
  index,
  onToggleFavorite,
  onToggleMastered,
  onUpdate,
}: QuestionCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  const categoryColors: Record<string, string> = {
    "技术": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "行为": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "公司": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    "职位": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  };

  const difficultyColors: Record<string, string> = {
    "简单": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    "中等": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    "困难": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            #{index + 1}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[question.category] || ""}`}>
            {question.category}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[question.difficulty] || ""}`}>
            {question.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(question.id)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            title={question.is_favorited ? "取消收藏" : "收藏"}
          >
            <Star
              className={`w-5 h-5 ${question.is_favorited ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
            />
          </button>
          <button
            onClick={() => onToggleMastered(question.id)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            title={question.is_mastered ? "标记为未掌握" : "标记为已掌握"}
          >
            <Check
              className={`w-5 h-5 ${question.is_mastered ? "fill-green-500 text-green-500" : "text-muted-foreground"}`}
            />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-4">{question.question}</h3>

      <div className="border-t pt-4">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showAnswer ? "隐藏答案" : "显示答案"}
        </button>

        {showAnswer && (
          <div className="p-4 bg-muted/50 rounded-md">
            <p className="text-sm whitespace-pre-wrap">{question.answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

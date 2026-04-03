"use client";

import { useState } from "react";
import { Question } from "@/lib/types";
import QuestionCard from "./QuestionCard";
import { Filter } from "lucide-react";

interface QuestionListProps {
  questions: Question[];
  onToggleFavorite: (id: string) => void;
  onToggleMastered: (id: string) => void;
  onUpdate: (question: Question) => void;
}

export default function QuestionList({
  questions,
  onToggleFavorite,
  onToggleMastered,
  onUpdate,
}: QuestionListProps) {
  const [filter, setFilter] = useState<"全部" | "收藏" | "未掌握">("全部");
  const [categoryFilter, setCategoryFilter] = useState<string>("全部");

  const categories = Array.from(new Set(questions.map((q) => q.category)));

  const filteredQuestions = questions.filter((q) => {
    if (filter === "收藏" && !q.is_favorited) return false;
    if (filter === "未掌握" && q.is_mastered) return false;
    if (categoryFilter !== "全部" && q.category !== categoryFilter) return false;
    return true;
  });

  const masteredCount = questions.filter((q) => q.is_mastered).length;
  const favoriteCount = questions.filter((q) => q.is_favorited).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">筛选:</span>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-1.5 border rounded-md text-sm"
          >
            <option value="全部">全部 ({questions.length})</option>
            <option value="收藏">收藏 ({favoriteCount})</option>
            <option value="未掌握">未掌握 ({questions.length - masteredCount})</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 border rounded-md text-sm"
          >
            <option value="全部">所有分类</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-muted-foreground">
          已掌握: {masteredCount}/{questions.length}
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          没有符合条件的题目
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={questions.indexOf(question)}
              onToggleFavorite={onToggleFavorite}
              onToggleMastered={onToggleMastered}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { JobDescription } from "@/lib/types";

interface JobDescFormProps {
  onSubmit: (jobDesc: JobDescription) => void;
  userId: string;
}

export default function JobDescForm({ onSubmit, userId }: JobDescFormProps) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("请填写职位名称和职位描述");
      return;
    }

    setSaving(true);

    try {
      const { data, error: dbError } = await supabase
        .from("job_descriptions")
        .insert({
          user_id: userId,
          title: title.trim(),
          company: company.trim() || "未知公司",
          content: content.trim(),
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    }
    setSaving(false);
  };

  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">职位描述</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            职位名称 <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="例如：高级前端工程师"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">公司名称</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="例如：字节跳动"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            职位描述 <span className="text-destructive">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-40 px-3 py-2 border rounded-md resize-none"
            placeholder="粘贴完整的职位描述内容，包含岗位职责、任职要求等..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存职位描述"}
        </button>
      </form>
    </div>
  );
}

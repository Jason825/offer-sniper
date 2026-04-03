"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Resume } from "@/lib/types";

interface ResumeUploaderProps {
  onUploadComplete: (resume: Resume) => void;
  userId: string;
}

export default function ResumeUploader({ onUploadComplete, userId }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("文件大小不能超过 10MB");
        return;
      }
      const ext = selectedFile.name.split(".").pop()?.toLowerCase();
      if (!["pdf", "txt"].includes(ext || "")) {
        setError("只支持 PDF 和 TXT 文件");
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      // Read file content
      const text = await readFileContent(file);
      setExtractedText(text);

      // Upload to Supabase Storage
      const fileName = `${userId}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("resumes")
        .getPublicUrl(fileName);

      // Save to database
      const { data: resume, error: dbError } = await supabase
        .from("resumes")
        .insert({
          user_id: userId,
          file_name: file.name,
          file_url: publicUrl,
          content: text,
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      onUploadComplete(resume);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    }
    setUploading(false);
  };

  const readFileContent = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "txt") {
      return await file.text();
    }

    if (ext === "pdf") {
      // Simple PDF text extraction (for demo - production should use proper library)
      // For now, we'll use the file name as placeholder
      return `[PDF文件: ${file.name}]\n请确保PDF内容可复制文本，否则建议将简历内容复制到TXT文件中上传。`;
    }

    return "";
  };

  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">上传简历</h3>

      <div className="space-y-4">
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-muted-foreground">点击选择文件 或 拖拽到此处</p>
              <p className="text-sm text-muted-foreground mt-1">
                支持 PDF、TXT 格式，最大 10MB
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded">
            {error}
          </div>
        )}

        {file && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {uploading ? "解析中..." : "解析简历"}
          </button>
        )}

        {extractedText && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">简历内容预览</label>
            <textarea
              value={extractedText}
              readOnly
              className="w-full h-32 px-3 py-2 border rounded-md text-sm bg-muted/50"
            />
          </div>
        )}
      </div>
    </div>
  );
}

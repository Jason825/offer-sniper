"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/client";
import { UserSettings } from "@/lib/types";

export default function SettingsPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [settings, setSettings] = useState<UserSettings>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email });
        fetchSettings(data.user.id);
      } else {
        router.push("/auth/login");
      }
    });
  }, []);

  const fetchSettings = async (userId: string) => {
    const { data } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (data) {
      setSettings(data);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage("");

    try {
      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: user.id,
          minimax_api_key: settings.minimax_api_key || null,
        });

      if (error) throw error;
      setMessage("设置已保存");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "保存失败");
    }
    setSaving(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">设置</h1>

        <div className="max-w-2xl">
          <div className="border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">账户信息</h2>
            <div className="text-sm text-muted-foreground">
              邮箱: {user.email}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">API 配置</h2>
            <p className="text-sm text-muted-foreground mb-4">
              配置你的 MiniMax API Key 用于生成面试题目。如果不配置，将使用系统默认配置的 API Key。
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  MiniMax API Key
                </label>
                <input
                  type="password"
                  value={settings.minimax_api_key || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, minimax_api_key: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="输入你的 MiniMax API Key"
                />
              </div>

              {message && (
                <div
                  className={`p-3 text-sm rounded ${
                    message.includes("失败")
                      ? "text-destructive bg-destructive/10"
                      : "text-green-600 bg-green-100"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? "保存中..." : "保存设置"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

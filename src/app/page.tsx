import Link from "next/link";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              精准狙击 <span className="text-primary">OFFER</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              上传你的简历和目标职位描述，AI 驱动的面试准备助手将为你生成针对性的面试问题和答案
            </p>
            <div className="flex gap-4 justify-center">
              {user ? (
                <Link
                  href="/upload"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
                >
                  开始准备面试
                </Link>
              ) : (
                <Link
                  href="/auth/register"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
                >
                  免费开始
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">工作流程</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border rounded-lg">
              <div className="text-4xl mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">上传简历</h3>
              <p className="text-muted-foreground">
                上传你的简历（PDF 或 TXT），系统将自动解析内容
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <div className="text-4xl mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">目标职位</h3>
              <p className="text-muted-foreground">
                输入你心仪的公司和职位描述
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <div className="text-4xl mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">AI 生成</h3>
              <p className="text-muted-foreground">
                AI 分析匹配，生成 20-30 道针对性面试题
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">功能特点</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4">
                <h3 className="font-semibold mb-2">智能分析</h3>
                <p className="text-sm text-muted-foreground">
                  基于简历和职位描述进行智能匹配
                </p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">题目精选</h3>
                <p className="text-sm text-muted-foreground">
                  涵盖技术、行为、公司文化等多维度
                </p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">答案参考</h3>
                <p className="text-sm text-muted-foreground">
                  每道题配有详细参考答案
                </p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">进度追踪</h3>
                <p className="text-sm text-muted-foreground">
                  标记已掌握题目，追踪面试准备进度
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2024 Offer Sniper. 精准狙击目标 OFFER。
        </div>
      </footer>
    </div>
  );
}

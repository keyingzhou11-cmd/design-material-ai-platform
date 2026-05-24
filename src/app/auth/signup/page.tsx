import { AuthForm } from '@/components/auth/AuthForm';

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-beige-100 px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-beige-200 bg-white p-8 shadow-soft">
        <div className="mb-8">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white font-display font-bold">
            A
          </div>
          <h1 className="font-display text-3xl text-ink">创建灵感工作台</h1>
          <p className="mt-2 text-sm text-ink-muted">
            开始收集、分析并组织你的设计灵感。
          </p>
        </div>
        <AuthForm mode="signup" />
      </div>
    </main>
  );
}

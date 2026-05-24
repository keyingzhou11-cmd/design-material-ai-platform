import { AuthForm } from '@/components/auth/AuthForm';

export default function LoginPage() {
  return (
    <AuthPageShell
      title="欢迎回来"
      description="登录你的 Atelier 灵感工作台。"
      mode="login"
    />
  );
}

function AuthPageShell({
  title,
  description,
  mode,
}: {
  title: string;
  description: string;
  mode: 'login' | 'signup';
}) {
  return (
    <main className="min-h-screen bg-beige-100 px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-beige-200 bg-white p-8 shadow-soft">
        <div className="mb-8">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white font-display font-bold">
            A
          </div>
          <h1 className="font-display text-3xl text-ink">{title}</h1>
          <p className="mt-2 text-sm text-ink-muted">{description}</p>
        </div>
        <AuthForm mode={mode} />
      </div>
    </main>
  );
}

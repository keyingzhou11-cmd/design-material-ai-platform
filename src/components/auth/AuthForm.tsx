'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';
  const next = searchParams.get('next') || '/dashboard';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const result = isSignup
        ? await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
          })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      router.replace(next);
      router.refresh();
    } catch (err) {
      console.error('AUTH ERROR', err);
      setError(
        err instanceof Error
          ? err.message
          : '无法连接 Supabase，请检查网络或环境变量配置。'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignup && (
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="姓名"
          autoComplete="name"
        />
      )}
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="邮箱"
        autoComplete="email"
        required
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="密码"
        autoComplete={isSignup ? 'new-password' : 'current-password'}
        minLength={6}
        required
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button className="w-full" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSignup ? '创建账号' : '登录'}
      </Button>

      <p className="text-center text-sm text-ink-muted">
        {isSignup ? '已有账号？' : '第一次使用 Atelier？'}{' '}
        <Link
          href={isSignup ? '/auth/login' : '/auth/signup'}
          className="font-medium text-accent hover:underline"
        >
          {isSignup ? '去登录' : '创建账号'}
        </Link>
      </p>
    </form>
  );
}

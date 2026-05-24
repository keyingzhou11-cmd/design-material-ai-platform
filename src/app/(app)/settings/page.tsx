'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const [name, setName] = useState('设计师');
  const [email, setEmail] = useState('atelier@studio.design');

  return (
    <>
      <PageHeader
        title="偏好设置"
        description="管理个人资料、推荐偏好与服务配置"
      />

      <div className="max-w-2xl space-y-6">
        <Card className="p-6">
          <h3 className="font-display text-lg text-ink mb-4">个人资料</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1.5 block">姓名</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1.5 block">邮箱</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <Button>保存资料</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg text-ink mb-4">使用偏好</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-ink">每日 AI 推荐</span>
              <input type="checkbox" defaultChecked className="rounded accent-accent" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-ink">自动保存画板</span>
              <input type="checkbox" defaultChecked className="rounded accent-accent" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-ink">深色模式</span>
              <input type="checkbox" className="rounded accent-accent" />
            </label>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg text-ink mb-2">服务配置</h3>
          <p className="text-sm text-ink-muted mb-4">
            在 <code className="text-xs bg-beige-200 px-1.5 py-0.5 rounded">.env.local</code> 中配置 Supabase 与 OpenAI 密钥。
          </p>
          <div className="rounded-xl bg-beige-50 border border-beige-200 p-4 font-mono text-xs text-ink-muted space-y-1">
            <p>NEXT_PUBLIC_SUPABASE_URL=...</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=...</p>
            <p>OPENAI_API_KEY=...</p>
          </div>
        </Card>
      </div>
    </>
  );
}

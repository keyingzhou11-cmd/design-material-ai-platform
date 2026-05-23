'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const [name, setName] = useState('Designer');
  const [email, setEmail] = useState('designer@atelier.app');

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your profile and preferences"
      />

      <div className="max-w-2xl space-y-6">
        <Card className="p-6">
          <h3 className="font-display text-lg text-ink mb-4">Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1.5 block">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1.5 block">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <Button>Save Profile</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg text-ink mb-4">Preferences</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-ink">Daily AI recommendations</span>
              <input type="checkbox" defaultChecked className="rounded accent-accent" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-ink">Auto-save moodboards</span>
              <input type="checkbox" defaultChecked className="rounded accent-accent" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-ink">Dark mode</span>
              <input type="checkbox" className="rounded accent-accent" />
            </label>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg text-ink mb-2">API Configuration</h3>
          <p className="text-sm text-ink-muted mb-4">
            Configure Supabase and OpenAI keys in your <code className="text-xs bg-beige-200 px-1.5 py-0.5 rounded">.env.local</code> file.
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

'use client';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function login() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
    else window.location.href = '/admin';
  }

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-4 text-fg">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6 flex items-center gap-2 text-accent"><Lock size={16} /><span className="text-xs uppercase tracking-[0.2em]">Beveiligd</span></div>
        <h1 className="font-display text-2xl font-semibold">Admin login</h1>
        <p className="mt-1 text-sm text-fg-muted">Log in om je shop te beheren.</p>
        <div className="mt-6 space-y-3">
          <input className="field" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="field" type="password" placeholder="Wachtwoord" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={login} className="btn btn-primary w-full justify-center">Inloggen</button>
        </div>
        {msg && <p className="mt-4 text-sm text-red-400">{msg}</p>}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Profile() {
  const { publicKey } = useWallet();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    display_name: '',
    bio: '',
    role: 'thinker',
    skills: [],
    portfolio_url: '',
    github_url: '',
    twitter_url: ''
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (publicKey) {
      authUser();
    } else {
      setLoading(false);
    }
  }, [publicKey]);

  const authUser = async () => {
    try {
      const res = await fetch('/api/users/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: publicKey.toString() })
      });
      const data = await res.json();
      setUser(data);
      setForm({
        display_name: data.display_name || '',
        bio: data.bio || '',
        role: data.role || 'thinker',
        skills: data.skills || [],
        portfolio_url: data.portfolio_url || '',
        github_url: data.github_url || '',
        twitter_url: data.twitter_url || ''
      });
    } catch (err) {
      console.error('Auth failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        alert('Profile saved!');
      }
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter(s => s !== skill) });
  };

  if (!publicKey) {
    return (
      <div className="pt-24 max-w-2xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Your Profile</h1>
        <p className="text-white/60 mb-8">Connect your wallet to view and edit your profile</p>
        <WalletMultiButton className="!bg-sol-purple hover:!bg-sol-purple/80 !rounded-full" />
      </div>
    );
  }

  if (loading) {
    return <div className="pt-24 text-center text-white/60">Loading...</div>;
  }

  return (
    <div className="pt-24 max-w-2xl mx-auto px-6">
      <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
      <p className="text-white/60 mb-8">
        {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
      </p>

      <form onSubmit={saveProfile} className="space-y-6">
        <div>
          <label className="block text-sm text-white/60 mb-2">Display Name</label>
          <input
            type="text"
            value={form.display_name}
            onChange={e => setForm({...form, display_name: e.target.value})}
            className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">Role</label>
          <select
            value={form.role}
            onChange={e => setForm({...form, role: e.target.value})}
            className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
          >
            <option value="thinker" className="bg-sol-dark">Thinker (I have ideas)</option>
            <option value="builder" className="bg-sol-dark">Builder (I build things)</option>
            <option value="both" className="bg-sol-dark">Both</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">Bio</label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={e => setForm({...form, bio: e.target.value})}
            className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
            placeholder="Tell us about yourself..."
          />
        </div>

        {(form.role === 'builder' || form.role === 'both') && (
          <>
            <div>
              <label className="block text-sm text-white/60 mb-2">Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="flex-1 bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
                  placeholder="Add a skill..."
                />
                <button type="button" onClick={addSkill} className="btn-secondary">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-sol-purple/20 rounded-full text-sm flex items-center gap-2">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="text-white/60 hover:text-white">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Portfolio URL</label>
              <input
                type="url"
                value={form.portfolio_url}
                onChange={e => setForm({...form, portfolio_url: e.target.value})}
                className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
                placeholder="https://yourportfolio.com"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm text-white/60 mb-2">GitHub</label>
          <input
            type="url"
            value={form.github_url}
            onChange={e => setForm({...form, github_url: e.target.value})}
            className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
            placeholder="https://github.com/username"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">Twitter</label>
          <input
            type="url"
            value={form.twitter_url}
            onChange={e => setForm({...form, twitter_url: e.target.value})}
            className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
            placeholder="https://twitter.com/username"
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}

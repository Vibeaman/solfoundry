import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Sparkle from '../components/Sparkle';
import Arrow from '../components/Arrow';

const CATEGORIES = ['defi', 'nft', 'tooling', 'gaming', 'infra', 'social', 'other'];

export default function CreateIdea() {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    problem: '',
    solution: '',
    category: 'defi',
    budget_min: '',
    budget_max: '',
    timeline_days: '',
    assets_url: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!publicKey) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          thinker_id: publicKey.toString()
        })
      });

      if (res.ok) {
        const idea = await res.json();
        navigate(`/ideas/${idea.id}`);
      }
    } catch (err) {
      console.error('Failed to create idea:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-8 md:px-16 py-12 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Sparkle className="text-sf-black" />
        <h1 className="text-4xl font-bold">Post Your Idea</h1>
      </div>
      <p className="text-sf-black/60 mb-8">Share your vision and let builders bid to make it real.</p>

      {!publicKey ? (
        <div className="card p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Connect your wallet</h2>
          <p className="text-sf-black/60 mb-8">You need to connect your Solana wallet to post an idea.</p>
          <WalletMultiButton />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-sf-black/60 mb-2">Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                className="w-full"
                placeholder="A catchy name for your idea"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sf-black/60 mb-2">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
                className="w-full"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-sf-black/60 mb-2">Problem</label>
              <textarea
                required
                rows={3}
                value={form.problem}
                onChange={e => setForm({...form, problem: e.target.value})}
                className="w-full"
                placeholder="What problem are you solving? Who feels this pain?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sf-black/60 mb-2">Solution</label>
              <textarea
                required
                rows={4}
                value={form.solution}
                onChange={e => setForm({...form, solution: e.target.value})}
                className="w-full"
                placeholder="Describe your vision. What does the end product look like?"
              />
            </div>
          </div>

          <div className="card p-8 space-y-6">
            <h3 className="text-lg font-semibold">Budget & Timeline</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-sf-black/60 mb-2">Budget Min (SOL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.budget_min}
                  onChange={e => setForm({...form, budget_min: e.target.value})}
                  className="w-full"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sf-black/60 mb-2">Budget Max (SOL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.budget_max}
                  onChange={e => setForm({...form, budget_max: e.target.value})}
                  className="w-full"
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sf-black/60 mb-2">Timeline (days)</label>
              <input
                type="number"
                value={form.timeline_days}
                onChange={e => setForm({...form, timeline_days: e.target.value})}
                className="w-full"
                placeholder="30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sf-black/60 mb-2">Assets URL (optional)</label>
              <input
                type="url"
                value={form.assets_url}
                onChange={e => setForm({...form, assets_url: e.target.value})}
                className="w-full"
                placeholder="Link to designs, docs, wireframes..."
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'POSTING...' : 'POST IDEA'} {!submitting && <Arrow />}
          </button>
        </form>
      )}
    </div>
  );
}

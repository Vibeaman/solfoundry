import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

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
    if (!publicKey) return alert('Please connect your wallet first');

    setSubmitting(true);
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          thinker_id: publicKey.toString() // simplified for now
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
    <div className="pt-24 max-w-2xl mx-auto px-6">
      <h1 className="text-4xl font-bold mb-2">Post Your Idea</h1>
      <p className="text-white/60 mb-8">Share your vision and let builders bid to make it real.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-white/60 mb-2">Title</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
            placeholder="A catchy name for your idea"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">Category</label>
          <select
            value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
            className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat} className="bg-sol-dark">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">Problem</label>
          <textarea
            required
            rows={3}
            value={form.problem}
            onChange={e => setForm({...form, problem: e.target.value})}
            className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
            placeholder="What problem are you solving? Who feels this pain?"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">Solution</label>
          <textarea
            required
            rows={4}
            value={form.solution}
            onChange={e => setForm({...form, solution: e.target.value})}
            className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
            placeholder="Describe your vision. What does the end product look like?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Budget Min (SOL)</label>
            <input
              type="number"
              step="0.1"
              value={form.budget_min}
              onChange={e => setForm({...form, budget_min: e.target.value})}
              className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Budget Max (SOL)</label>
            <input
              type="number"
              step="0.1"
              value={form.budget_max}
              onChange={e => setForm({...form, budget_max: e.target.value})}
              className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
              placeholder="10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">Timeline (days)</label>
          <input
            type="number"
            value={form.timeline_days}
            onChange={e => setForm({...form, timeline_days: e.target.value})}
            className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
            placeholder="30"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">Assets URL (optional)</label>
          <input
            type="url"
            value={form.assets_url}
            onChange={e => setForm({...form, assets_url: e.target.value})}
            className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
            placeholder="Link to designs, docs, wireframes..."
          />
        </div>

        <button 
          type="submit" 
          disabled={submitting || !publicKey}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!publicKey ? 'Connect Wallet to Post' : submitting ? 'Posting...' : 'Post Idea'}
        </button>
      </form>
    </div>
  );
}

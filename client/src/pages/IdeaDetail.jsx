import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

export default function IdeaDetail() {
  const { id } = useParams();
  const { publicKey } = useWallet();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidForm, setBidForm] = useState({
    proposed_cost: '',
    timeline_days: '',
    approach: '',
    why_me: ''
  });

  useEffect(() => {
    fetchIdea();
  }, [id]);

  const fetchIdea = async () => {
    try {
      const res = await fetch(`/api/ideas/${id}`);
      const data = await res.json();
      setIdea(data);
    } catch (err) {
      console.error('Failed to fetch idea:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitBid = async (e) => {
    e.preventDefault();
    if (!publicKey) return alert('Please connect your wallet');

    try {
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea_id: id,
          builder_id: publicKey.toString(), // simplified for now
          ...bidForm
        })
      });
      
      if (res.ok) {
        setShowBidForm(false);
        fetchIdea(); // refresh
      }
    } catch (err) {
      console.error('Failed to submit bid:', err);
    }
  };

  if (loading) {
    return <div className="pt-24 text-center text-white/60">Loading...</div>;
  }

  if (!idea) {
    return <div className="pt-24 text-center text-white/60">Idea not found</div>;
  }

  return (
    <div className="pt-24 max-w-4xl mx-auto px-6">
      <div className="gradient-border p-8 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-sol-purple/20 text-sol-purple rounded-full text-sm">
            {idea.category}
          </span>
          <span className="px-3 py-1 bg-sol-green/20 text-sol-green rounded-full text-sm">
            {idea.status}
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-4">{idea.title}</h1>
        
        <div className="text-white/60 text-sm mb-6">
          Posted by {idea.thinker_name} • {idea.budget_min} - {idea.budget_max} SOL • {idea.timeline_days} days
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Problem</h3>
            <p className="text-white/80">{idea.problem}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Solution</h3>
            <p className="text-white/80">{idea.solution}</p>
          </div>

          {idea.assets_url && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Assets</h3>
              <a href={idea.assets_url} target="_blank" rel="noopener" className="text-sol-purple hover:underline">
                View attached documents →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Bids Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Bids ({idea.bids?.length || 0})</h2>
          {idea.status === 'posted' && (
            <button onClick={() => setShowBidForm(true)} className="btn-primary">
              Submit Bid
            </button>
          )}
        </div>

        {idea.bids?.length > 0 ? (
          <div className="space-y-4">
            {idea.bids.map(bid => (
              <div key={bid.id} className="gradient-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-semibold">{bid.builder_name}</span>
                    <span className="text-white/40 ml-2">• {bid.timeline_days} days</span>
                  </div>
                  <span className="text-sol-green font-bold">{bid.proposed_cost} SOL</span>
                </div>
                <p className="text-white/80 text-sm mb-2">{bid.approach}</p>
                {bid.why_me && (
                  <p className="text-white/60 text-sm italic">"{bid.why_me}"</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/60 text-center py-8">No bids yet. Be the first!</p>
        )}
      </div>

      {/* Bid Form Modal */}
      {showBidForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-sol-gray rounded-xl p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-6">Submit Your Bid</h2>
            <form onSubmit={submitBid} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Proposed Cost (SOL)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={bidForm.proposed_cost}
                  onChange={e => setBidForm({...bidForm, proposed_cost: e.target.value})}
                  className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Timeline (days)</label>
                <input
                  type="number"
                  required
                  value={bidForm.timeline_days}
                  onChange={e => setBidForm({...bidForm, timeline_days: e.target.value})}
                  className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Your Approach</label>
                <textarea
                  required
                  rows={3}
                  value={bidForm.approach}
                  onChange={e => setBidForm({...bidForm, approach: e.target.value})}
                  className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
                  placeholder="How would you build this?"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Why You? (optional)</label>
                <textarea
                  rows={2}
                  value={bidForm.why_me}
                  onChange={e => setBidForm({...bidForm, why_me: e.target.value})}
                  className="w-full bg-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sol-purple"
                  placeholder="What makes you the right builder?"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowBidForm(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Submit Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

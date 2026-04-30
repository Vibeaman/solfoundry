import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import Sparkle from '../components/Sparkle';
import Arrow from '../components/Arrow';

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
          builder_id: publicKey.toString(),
          ...bidForm
        })
      });
      
      if (res.ok) {
        setShowBidForm(false);
        fetchIdea();
      }
    } catch (err) {
      console.error('Failed to submit bid:', err);
    }
  };

  if (loading) {
    return <div className="px-8 md:px-16 py-12 text-center text-sf-black/60">Loading...</div>;
  }

  if (!idea) {
    return <div className="px-8 md:px-16 py-12 text-center text-sf-black/60">Idea not found</div>;
  }

  return (
    <div className="px-8 md:px-16 py-12">
      {/* Back link */}
      <Link to="/ideas" className="inline-flex items-center gap-2 text-sm text-sf-black/60 hover:text-sf-black mb-8">
        ← Back to ideas
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="card p-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="tag tag-primary text-xs">
                {idea.category.toUpperCase()}
              </span>
              <span className="tag text-xs">
                {idea.status.toUpperCase()}
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-4">{idea.title}</h1>
            
            <div className="text-sf-black/60 text-sm mb-8 pb-4 border-b border-sf-black/10">
              Posted by {idea.thinker_name} • {idea.budget_min} - {idea.budget_max} SOL • {idea.timeline_days} days
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-sf-black/40 mb-3">Problem</h3>
                <p className="text-sf-black/80 leading-relaxed">{idea.problem}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-sf-black/40 mb-3">Solution</h3>
                <p className="text-sf-black/80 leading-relaxed">{idea.solution}</p>
              </div>

              {idea.assets_url && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-sf-black/40 mb-3">Assets</h3>
                  <a href={idea.assets_url} target="_blank" rel="noopener" className="text-sf-black font-medium hover:opacity-60">
                    View attached documents →
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Bids Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkle className="text-sf-black" />
                <h2 className="text-2xl font-bold">Bids ({idea.bids?.length || 0})</h2>
              </div>
              {idea.status === 'posted' && (
                <button onClick={() => setShowBidForm(true)} className="btn-primary">
                  SUBMIT BID <Arrow />
                </button>
              )}
            </div>

            {idea.bids?.length > 0 ? (
              <div className="space-y-4">
                {idea.bids.map(bid => (
                  <div key={bid.id} className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="font-semibold">{bid.builder_name}</span>
                        <span className="text-sf-black/40 ml-2">• {bid.timeline_days} days</span>
                      </div>
                      <span className="text-xl font-bold">{bid.proposed_cost} SOL</span>
                    </div>
                    <p className="text-sf-black/80 text-sm mb-2">{bid.approach}</p>
                    {bid.why_me && (
                      <p className="text-sf-black/60 text-sm italic">"{bid.why_me}"</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <p className="text-sf-black/60">No bids yet. Be the first!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-sf-black/40 mb-4">Quick Info</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-sf-black/10">
                <span className="text-sf-black/60">Budget</span>
                <span className="font-semibold">{idea.budget_min} - {idea.budget_max} SOL</span>
              </div>
              <div className="flex justify-between py-3 border-b border-sf-black/10">
                <span className="text-sf-black/60">Timeline</span>
                <span className="font-semibold">{idea.timeline_days} days</span>
              </div>
              <div className="flex justify-between py-3 border-b border-sf-black/10">
                <span className="text-sf-black/60">Bids</span>
                <span className="font-semibold">{idea.bids?.length || 0}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sf-black/60">Status</span>
                <span className="font-semibold">{idea.status}</span>
              </div>
            </div>

            {idea.status === 'posted' && (
              <button 
                onClick={() => setShowBidForm(true)} 
                className="btn-primary w-full mt-6 justify-center"
              >
                SUBMIT BID <Arrow />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bid Form Modal */}
      {showBidForm && (
        <div className="fixed inset-0 bg-sf-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-sf-white border border-sf-black p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Submit Your Bid</h2>
            <form onSubmit={submitBid} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sf-black/60 mb-2">Proposed Cost (SOL)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={bidForm.proposed_cost}
                  onChange={e => setBidForm({...bidForm, proposed_cost: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sf-black/60 mb-2">Timeline (days)</label>
                <input
                  type="number"
                  required
                  value={bidForm.timeline_days}
                  onChange={e => setBidForm({...bidForm, timeline_days: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sf-black/60 mb-2">Your Approach</label>
                <textarea
                  required
                  rows={3}
                  value={bidForm.approach}
                  onChange={e => setBidForm({...bidForm, approach: e.target.value})}
                  className="w-full"
                  placeholder="How would you build this?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sf-black/60 mb-2">Why You? (optional)</label>
                <textarea
                  rows={2}
                  value={bidForm.why_me}
                  onChange={e => setBidForm({...bidForm, why_me: e.target.value})}
                  className="w-full"
                  placeholder="What makes you the right builder?"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowBidForm(false)} className="btn-secondary flex-1 justify-center">
                  CANCEL
                </button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  SUBMIT <Arrow />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

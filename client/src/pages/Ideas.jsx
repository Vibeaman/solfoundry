import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['all', 'defi', 'nft', 'tooling', 'gaming', 'infra', 'social', 'other'];

export default function Ideas() {
  const [ideas, setIdeas] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdeas();
  }, [category]);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      params.set('status', 'posted');
      
      const res = await fetch(`/api/ideas?${params}`);
      const data = await res.json();
      setIdeas(data);
    } catch (err) {
      console.error('Failed to fetch ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Browse Ideas</h1>
          <p className="text-white/60">Find your next project to build</p>
        </div>
        <Link to="/create" className="btn-primary mt-4 md:mt-0">
          Post an Idea
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              category === cat 
                ? 'bg-sol-purple text-white' 
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Ideas Grid */}
      {loading ? (
        <div className="text-center py-20 text-white/60">Loading ideas...</div>
      ) : ideas.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/60 mb-4">No ideas found. Be the first to post one!</p>
          <Link to="/create" className="btn-primary">
            Post an Idea
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map(idea => (
            <Link 
              key={idea.id} 
              to={`/ideas/${idea.id}`}
              className="gradient-border p-6 hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-sol-purple/20 text-sol-purple rounded-full text-sm">
                  {idea.category}
                </span>
                <span className="text-white/40 text-sm">{idea.bid_count || 0} bids</span>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{idea.title}</h3>
              <p className="text-white/60 text-sm mb-4 line-clamp-2">{idea.problem}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-sol-green">
                  {idea.budget_min} - {idea.budget_max} SOL
                </span>
                <span className="text-white/40">
                  by {idea.thinker_name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

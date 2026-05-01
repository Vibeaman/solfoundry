import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sparkle from '../components/Sparkle';
import Arrow from '../components/Arrow';
import { API_URL } from '../config';

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
      
      const res = await fetch(`${API_URL}/api/ideas?${params}`);
      const data = await res.json();
      setIdeas(data);
    } catch (err) {
      console.error('Failed to fetch ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8 md:px-16 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-2">
          <Sparkle className="text-sf-black" />
          <h1 className="text-4xl font-bold">Browse Ideas</h1>
        </div>
        <Link to="/create" className="btn-primary">
          POST IDEA <Arrow />
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b-section">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium ${
              category === cat 
                ? 'bg-sf-black text-white' 
                : 'bg-transparent border border-sf-black/20 hover:border-sf-black'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Ideas Grid */}
      {loading ? (
        <div className="text-center py-20 text-sf-black/60">Loading ideas...</div>
      ) : ideas.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sf-black/60 mb-4">No ideas found. Be the first to post one!</p>
          <Link to="/create" className="btn-primary">
            POST IDEA <Arrow />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map(idea => (
            <Link 
              key={idea.id} 
              to={`/ideas/${idea.id}`}
              className="card p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="tag tag-primary text-xs">
                  {idea.category.toUpperCase()}
                </span>
                <span className="text-sf-black/40 text-sm">{idea.bid_count || 0} bids</span>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{idea.title}</h3>
              <p className="text-sf-black/60 text-sm mb-4 line-clamp-2">{idea.problem}</p>
              
              <div className="flex items-center justify-between text-sm pt-4 border-t border-sf-black/10">
                <span className="font-semibold">
                  {idea.budget_min} - {idea.budget_max} SOL
                </span>
                <span className="text-sf-black/40">
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

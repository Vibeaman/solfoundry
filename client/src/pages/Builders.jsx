import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Builders() {
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuilders();
  }, []);

  const fetchBuilders = async () => {
    try {
      const res = await fetch('/api/builders');
      const data = await res.json();
      setBuilders(data);
    } catch (err) {
      console.error('Failed to fetch builders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Builders</h1>
        <p className="text-white/60">Talented developers ready to bring ideas to life</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/60">Loading builders...</div>
      ) : builders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/60 mb-4">No builders yet. Be the first to join!</p>
          <Link to="/profile" className="btn-primary">
            Create Builder Profile
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builders.map(builder => (
            <div key={builder.id} className="gradient-border p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-sol-purple/30 flex items-center justify-center">
                  <span className="text-xl">👨‍💻</span>
                </div>
                <div>
                  <h3 className="font-semibold">{builder.display_name}</h3>
                  {builder.avg_rating && (
                    <span className="text-yellow-400 text-sm">
                      ⭐ {Number(builder.avg_rating).toFixed(1)}
                    </span>
                  )}
                </div>
              </div>

              {builder.bio && (
                <p className="text-white/60 text-sm mb-4 line-clamp-2">{builder.bio}</p>
              )}

              {builder.skills && builder.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {builder.skills.slice(0, 4).map(skill => (
                    <span key={skill} className="px-2 py-1 bg-white/10 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-white/40">
                <span>{builder.projects_won || 0} projects</span>
                <span>{builder.total_bids || 0} bids</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

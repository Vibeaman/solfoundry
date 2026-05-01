import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sparkle from '../components/Sparkle';
import Arrow from '../components/Arrow';
import { API_URL } from '../config';

export default function Builders() {
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuilders();
  }, []);

  const fetchBuilders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/builders`);
      const data = await res.json();
      setBuilders(data);
    } catch (err) {
      console.error('Failed to fetch builders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8 md:px-16 py-12">
      <div className="flex items-center gap-2 mb-2">
        <Sparkle className="text-sf-black" />
        <h1 className="text-4xl font-bold">Builders</h1>
      </div>
      <p className="text-sf-black/60 mb-8">Talented developers ready to bring ideas to life</p>

      {loading ? (
        <div className="text-center py-20 text-sf-black/60">Loading builders...</div>
      ) : builders.length === 0 ? (
        <div className="card p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">No builders yet</h2>
          <p className="text-sf-black/60 mb-8">Be the first to create a builder profile!</p>
          <Link to="/profile" className="btn-primary">
            CREATE PROFILE <Arrow />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builders.map(builder => (
            <div key={builder.id} className="card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-sf-gray flex items-center justify-center border border-sf-black/10">
                  <span className="text-xl">👨‍💻</span>
                </div>
                <div>
                  <h3 className="font-semibold">{builder.display_name}</h3>
                  {builder.avg_rating && (
                    <span className="text-sm text-sf-black/60">
                      ⭐ {Number(builder.avg_rating).toFixed(1)}
                    </span>
                  )}
                </div>
              </div>

              {builder.bio && (
                <p className="text-sf-black/60 text-sm mb-4 line-clamp-2">{builder.bio}</p>
              )}

              {builder.skills && builder.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {builder.skills.slice(0, 4).map(skill => (
                    <span key={skill} className="tag text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-sf-black/40 pt-4 border-t border-sf-black/10">
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

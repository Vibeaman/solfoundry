import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Where <span className="gradient-text">Ideas</span> Meet{' '}
          <span className="gradient-text">Builders</span>
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
          Got a vision but lack the resources? SolFoundry connects idea-driven creators 
          with builders ready to execute, all powered by Solana.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/create" className="btn-primary">
            Post Your Idea
          </Link>
          <Link to="/ideas" className="btn-secondary">
            Browse Ideas
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="gradient-border p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-sol-purple/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">💡</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">1. Share Your Idea</h3>
            <p className="text-white/60">
              Describe your vision, the problem you're solving, and what you need to bring it to life.
            </p>
          </div>

          <div className="gradient-border p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-sol-purple/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🛠️</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">2. Get Bids</h3>
            <p className="text-white/60">
              Builders review your idea and submit competitive bids with their approach and timeline.
            </p>
          </div>

          <div className="gradient-border p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-sol-purple/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">3. Build & Launch</h3>
            <p className="text-white/60">
              Choose your builder, lock funds in escrow, and watch your idea become reality.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-sol-gray py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold gradient-text">0</div>
              <div className="text-white/60 mt-2">Ideas Posted</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text">0</div>
              <div className="text-white/60 mt-2">Builders</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text">0</div>
              <div className="text-white/60 mt-2">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text">0 SOL</div>
              <div className="text-white/60 mt-2">Total Value Locked</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Build Something Great?</h2>
        <p className="text-white/60 mb-8 max-w-xl mx-auto">
          Whether you have an idea waiting to be built or skills ready to be put to work, 
          SolFoundry is where it happens.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/create" className="btn-primary">
            I Have an Idea
          </Link>
          <Link to="/builders" className="btn-secondary">
            I'm a Builder
          </Link>
        </div>
      </section>
    </div>
  );
}

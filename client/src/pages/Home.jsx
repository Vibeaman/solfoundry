import { Link } from 'react-router-dom';
import Sparkle from '../components/Sparkle';
import Arrow from '../components/Arrow';
import Hero3D from '../components/Hero3D';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="grid md:grid-cols-2 min-h-[70vh]">
        {/* Left - Content */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-16">
          <div className="flex items-center gap-2 mb-6">
            <Sparkle className="text-sf-black" />
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
            Where ideas<br />
            meet builders<br />
            on Solana
          </h1>
          
          <p className="text-lg text-sf-black/60 max-w-md mb-10">
            Got a vision but lack the resources? Connect with builders ready to execute, 
            all secured by smart contract escrow.
          </p>
          
          <div className="flex items-center gap-4 mb-12">
            <Link to="/create" className="btn-primary">
              POST IDEA <Arrow />
            </Link>
            <Link to="/ideas" className="btn-secondary">
              BROWSE IDEAS
            </Link>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-sf-red">✱</span>
            <span className="text-sf-black/60">Trustless escrow protects both parties</span>
          </div>
        </div>

        {{/* Right - 3D Illustration */}
        <div className="border-l-section relative overflow-hidden hidden md:block">
          <Hero3D />
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="text-3xl font-bold">0</div>
          <div className="text-sm text-sf-black/60">ideas posted</div>
        </div>
        <div className="stat-item">
          <div className="text-3xl font-bold">0</div>
          <div className="text-sm text-sf-black/60">builders</div>
        </div>
        <div className="stat-item">
          <div className="text-3xl font-bold">0</div>
          <div className="text-sm text-sf-black/60">projects funded</div>
        </div>
        <div className="stat-item hidden md:block">
          <div className="text-3xl font-bold">0 SOL</div>
          <div className="text-sm text-sf-black/60">in escrow</div>
        </div>
      </div>

      {/* How it Works */}
      <section className="px-8 md:px-16 py-20 border-t-section">
        <div className="flex items-center gap-2 mb-12">
          <Sparkle className="text-sf-black" />
          <h2 className="text-3xl font-bold">How it works</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card card-3d p-8">
            <div className="text-4xl font-bold text-sf-black/20 mb-4">01</div>
            <h3 className="text-xl font-semibold mb-3">Share your idea</h3>
            <p className="text-sf-black/60">
              Describe your vision, the problem you're solving, and what you need to bring it to life.
            </p>
          </div>

          <div className="card card-3d p-8">
            <div className="text-4xl font-bold text-sf-black/20 mb-4">02</div>
            <h3 className="text-xl font-semibold mb-3">Get bids from builders</h3>
            <p className="text-sf-black/60">
              Builders review your idea and submit competitive proposals with their approach and timeline.
            </p>
          </div>

          <div className="card card-3d p-8">
            <div className="text-4xl font-bold text-sf-black/20 mb-4">03</div>
            <h3 className="text-xl font-semibold mb-3">Build with escrow</h3>
            <p className="text-sf-black/60">
              Choose your builder, lock funds in smart contract escrow, and release on delivery.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-16 py-20 border-t-section bg-sf-gray/30">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to build something?</h2>
          <p className="text-lg text-sf-black/60 mb-8">
            Whether you have an idea waiting to be built or skills ready to execute, 
            SolFoundry is where it happens.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/create" className="btn-primary">
              I HAVE AN IDEA <Arrow />
            </Link>
            <Link to="/profile" className="btn-secondary">
              I'M A BUILDER
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

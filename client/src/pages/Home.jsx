import { Link } from 'react-router-dom';
import Sparkle from '../components/Sparkle';
import Arrow from '../components/Arrow';

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

        {/* Right - Illustration */}
        <div className="border-l-section bg-sf-gray/50 relative overflow-hidden hidden md:flex items-center justify-center">
          {/* Abstract geometric shapes */}
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Network nodes */}
            <circle cx="200" cy="80" r="8" fill="#0D0D0D"/>
            <circle cx="280" cy="120" r="8" fill="#0D0D0D"/>
            <circle cx="320" cy="80" r="8" fill="#0D0D0D"/>
            <circle cx="240" cy="40" r="8" fill="#0D0D0D"/>
            <line x1="200" y1="80" x2="280" y2="120" stroke="#0D0D0D" strokeWidth="1"/>
            <line x1="280" y1="120" x2="320" y2="80" stroke="#0D0D0D" strokeWidth="1"/>
            <line x1="200" y1="80" x2="240" y2="40" stroke="#0D0D0D" strokeWidth="1"/>
            <line x1="240" y1="40" x2="320" y2="80" stroke="#0D0D0D" strokeWidth="1"/>
            
            {/* Red triangle */}
            <polygon points="260,100 300,160 220,160" fill="#E54D4D"/>
            
            {/* Blue capsule */}
            <rect x="180" y="180" width="120" height="60" rx="30" fill="#5B9BD5"/>
            <circle cx="270" cy="210" r="20" fill="white"/>
            
            {/* Black cursor/arrow */}
            <polygon points="220,280 280,340 250,340 260,380 230,370 220,340 190,340" fill="#0D0D0D"/>
            
            {/* Red wave */}
            <path d="M140,300 Q200,250 260,300 Q320,350 380,300 L380,400 L140,400 Z" fill="#E54D4D" opacity="0.8"/>
            
            {/* Dotted texture circles */}
            <circle cx="340" cy="320" r="20" fill="#D4E5F7" opacity="0.6"/>
            <circle cx="360" cy="360" r="15" fill="#D4E5F7" opacity="0.6"/>
            <circle cx="320" cy="370" r="12" fill="#D4E5F7" opacity="0.6"/>
          </svg>
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
          <div className="card p-8">
            <div className="text-4xl font-bold text-sf-black/20 mb-4">01</div>
            <h3 className="text-xl font-semibold mb-3">Share your idea</h3>
            <p className="text-sf-black/60">
              Describe your vision, the problem you're solving, and what you need to bring it to life.
            </p>
          </div>

          <div className="card p-8">
            <div className="text-4xl font-bold text-sf-black/20 mb-4">02</div>
            <h3 className="text-xl font-semibold mb-3">Get bids from builders</h3>
            <p className="text-sf-black/60">
              Builders review your idea and submit competitive proposals with their approach and timeline.
            </p>
          </div>

          <div className="card p-8">
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

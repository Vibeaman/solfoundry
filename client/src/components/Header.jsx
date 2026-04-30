import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-sol-dark/80 backdrop-blur-md border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold gradient-text">SolFoundry</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/ideas" className="text-white/70 hover:text-white transition-colors">
            Ideas
          </Link>
          <Link to="/builders" className="text-white/70 hover:text-white transition-colors">
            Builders
          </Link>
          <Link to="/create" className="text-white/70 hover:text-white transition-colors">
            Post Idea
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <WalletMultiButton className="!bg-sol-purple hover:!bg-sol-purple/80 !rounded-full !h-10" />
        </div>
      </nav>
    </header>
  );
}

import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Header() {
  return (
    <header className="border-b-section">
      <nav className="flex items-center justify-between px-8 py-4">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-lg font-semibold tracking-tight">// SolFoundry</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/ideas" className="text-sf-black hover:opacity-60 transition-opacity text-sm font-medium">
            IDEAS
          </Link>
          <Link to="/builders" className="text-sf-black hover:opacity-60 transition-opacity text-sm font-medium">
            BUILDERS
          </Link>
          <Link to="/create" className="text-sf-black hover:opacity-60 transition-opacity text-sm font-medium">
            POST IDEA
          </Link>
        </div>

        <WalletMultiButton />
      </nav>
    </header>
  );
}

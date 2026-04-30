import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <span className="text-xl font-bold gradient-text">SolFoundry</span>
            <p className="mt-4 text-white/60 text-sm">
              Where raw ideas are transformed into real, working products on Solana.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li><Link to="/ideas" className="hover:text-white">Browse Ideas</Link></li>
              <li><Link to="/builders" className="hover:text-white">Find Builders</Link></li>
              <li><Link to="/create" className="hover:text-white">Post an Idea</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li><a href="#" className="hover:text-white">Documentation</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li><a href="https://twitter.com" className="hover:text-white">Twitter</a></li>
              <li><a href="https://discord.com" className="hover:text-white">Discord</a></li>
              <li><a href="https://github.com/Vibeaman/solfoundry" className="hover:text-white">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/40 text-sm">
          © 2026 SolFoundry. Built on Solana.
        </div>
      </div>
    </footer>
  );
}

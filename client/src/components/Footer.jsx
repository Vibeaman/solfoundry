export default function Footer() {
  return (
    <footer className="border-t-section">
      <div className="flex flex-col md:flex-row items-center justify-between px-8 py-6 gap-4">
        <div className="flex items-center gap-1 text-sm">
          <span className="opacity-60">Built on</span>
          <span className="font-semibold">Solana</span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <span className="opacity-60">
            Built by{' '}
            <a 
              href="https://x.com/0xvibeaman" 
              target="_blank" 
              rel="noopener noreferrer"
              className="credits-link font-semibold"
            >
              VIBÆMAN
            </a>
          </span>
          <span className="opacity-40">•</span>
          <span className="opacity-60">
            Idea by{' '}
            <a 
              href="https://x.com/ene_anthonyy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="credits-link font-semibold"
            >
              ene_anthonyy
            </a>
          </span>
        </div>

        <div className="text-sm opacity-60">
          © 2026 SolFoundry
        </div>
      </div>
    </footer>
  );
}

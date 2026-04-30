# SolFoundry

A marketplace on Solana where raw ideas are transformed into real, working products.

## What is SolFoundry?

SolFoundry connects:
- **Thinkers** - People with strong product visions but limited resources
- **Builders** - Developers ready to execute
- **Fundraisers** (v2) - People who can secure capital

## How it Works

1. Thinker posts an idea (problem, vision, budget range)
2. Builders review and bid on projects
3. Thinker selects a builder
4. Escrow locks funds on Solana
5. Builder delivers, funds release

## Tech Stack

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express + PostgreSQL
- **Blockchain:** Solana (Anchor framework)
- **Deployment:** Vercel (frontend) + Railway (backend)

## Project Structure

```
solfoundry/
├── client/                 # React frontend
├── server/                 # Express API
├── programs/               # Anchor/Solana programs
│   └── solfoundry/        # Escrow program
├── tests/                  # Program tests
└── migrations/            # Database migrations
```

## Getting Started

### Prerequisites
- Node.js 18+
- Rust & Anchor CLI
- Solana CLI
- PostgreSQL

### Installation

```bash
# Clone
git clone https://github.com/Vibeaman/solfoundry.git
cd solfoundry

# Install dependencies
npm install

# Setup database
createdb solfoundry
npm run migrate

# Start development
npm run dev
```

## Roadmap

### Phase 1 (MVP)
- [x] Project setup
- [ ] Idea submission & listing
- [ ] Builder profiles
- [ ] Bidding system
- [ ] Basic escrow (SOL/USDC)

### Phase 2
- [ ] Fundraiser role
- [ ] Milestone-based payments
- [ ] Reputation system
- [ ] Dispute resolution

## License

MIT

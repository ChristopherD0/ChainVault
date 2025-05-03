# ChainVault 🔐

A personal cryptocurrency portfolio tracking tool built with Node.js and SQLite.

## Features

- Track your crypto holdings with purchase prices and amounts
- Real-time price updates via CoinGecko API
- Calculate portfolio value and P&L
- Clean, responsive web interface
- Local SQLite database for privacy
- Support for major cryptocurrencies (BTC, ETH, ADA, DOT, LINK, UNI, MATIC, SOL)

## Setup

1. Clone the repository
```bash
git clone https://github.com/ChristopherD0/ChainVault.git
cd ChainVault
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
npm start
```

4. Open http://localhost:3000 in your browser

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

## API Endpoints

- `GET /api/portfolio` - Get basic portfolio data
- `POST /api/portfolio` - Add new asset to portfolio
- `GET /api/portfolio/values` - Get portfolio with current prices and P&L
- `GET /api/price/:symbol` - Get current price for a symbol

## Database

The app uses SQLite with two tables:
- `portfolio` - Your asset holdings
- `prices` - Price cache for faster lookups

## Privacy

All data is stored locally in SQLite database. No personal information is sent to external APIs except for fetching public cryptocurrency prices.

## License

MIT
const axios = require('axios');
const db = require('./db');

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const symbolMap = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'ADA': 'cardano',
    'DOT': 'polkadot',
    'LINK': 'chainlink',
    'UNI': 'uniswap',
    'MATIC': 'matic-network',
    'SOL': 'solana'
};

async function getCurrentPrice(symbol) {
    try {
        const coinId = symbolMap[symbol.toUpperCase()];
        if (!coinId) {
            throw new Error(`Unsupported symbol: ${symbol}`);
        }
        
        const response = await axios.get(`${COINGECKO_API}/simple/price`, {
            params: {
                ids: coinId,
                vs_currencies: 'usd'
            }
        });
        
        const price = response.data[coinId]?.usd;
        if (!price) throw new Error('Price not found');
        
        // Store price in database
        db.run('INSERT INTO prices (symbol, price) VALUES (?, ?)', [symbol.toUpperCase(), price]);
        
        return price;
    } catch (error) {
        console.error('Error fetching price for', symbol, ':', error.message);
        // Return cached price if available
        return new Promise((resolve, reject) => {
            db.get('SELECT price FROM prices WHERE symbol = ? ORDER BY timestamp DESC LIMIT 1', 
                   [symbol.toUpperCase()], (err, row) => {
                if (err || !row) reject(error);
                else resolve(row.price);
            });
        });
    }
}

async function updatePortfolioPrices() {
    return new Promise((resolve, reject) => {
        db.all('SELECT DISTINCT symbol FROM portfolio', [], async (err, rows) => {
            if (err) return reject(err);
            
            const updates = [];
            for (const row of rows) {
                try {
                    const price = await getCurrentPrice(row.symbol);
                    updates.push({ symbol: row.symbol, price });
                } catch (error) {
                    console.error('Failed to update price for', row.symbol);
                }
            }
            resolve(updates);
        });
    });
}

module.exports = {
    getCurrentPrice,
    updatePortfolioPrices
};
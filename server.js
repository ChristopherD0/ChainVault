const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const priceService = require('./priceService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('ChainVault - Crypto Portfolio Tracker');
});

// Get portfolio
app.get('/api/portfolio', (req, res) => {
    db.all('SELECT * FROM portfolio', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Add to portfolio
app.post('/api/portfolio', (req, res) => {
    const { symbol, amount, purchase_price, notes } = req.body;
    const purchase_date = new Date().toISOString();
    
    db.run(
        'INSERT INTO portfolio (symbol, amount, purchase_price, purchase_date, notes) VALUES (?, ?, ?, ?, ?)',
        [symbol, amount, purchase_price, purchase_date, notes],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        }
    );
});

// Get current price for a symbol
app.get('/api/price/:symbol', async (req, res) => {
    try {
        const price = await priceService.getCurrentPrice(req.params.symbol);
        res.json({ symbol: req.params.symbol, price });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get portfolio with current values
app.get('/api/portfolio/values', async (req, res) => {
    try {
        const portfolio = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM portfolio', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        const portfolioWithValues = await Promise.all(
            portfolio.map(async (item) => {
                try {
                    const currentPrice = await priceService.getCurrentPrice(item.symbol);
                    const currentValue = item.amount * currentPrice;
                    const pnl = currentValue - (item.amount * item.purchase_price);
                    
                    return {
                        ...item,
                        current_price: currentPrice,
                        current_value: currentValue,
                        pnl: pnl,
                        pnl_percent: ((currentPrice - item.purchase_price) / item.purchase_price * 100)
                    };
                } catch (error) {
                    return { ...item, current_price: null, error: 'Price unavailable' };
                }
            })
        );

        res.json(portfolioWithValues);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
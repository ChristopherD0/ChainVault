const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
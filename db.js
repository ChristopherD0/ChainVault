const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'portfolio.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initDatabase();
    }
});

function initDatabase() {
    const createPortfolioTable = `
        CREATE TABLE IF NOT EXISTS portfolio (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT NOT NULL,
            amount REAL NOT NULL,
            purchase_price REAL NOT NULL,
            purchase_date DATE NOT NULL,
            notes TEXT
        )
    `;

    const createPricesTable = `
        CREATE TABLE IF NOT EXISTS prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT NOT NULL,
            price REAL NOT NULL,
            timestamp DATE DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.run(createPortfolioTable, (err) => {
        if (err) console.error('Error creating portfolio table:', err);
    });

    db.run(createPricesTable, (err) => {
        if (err) console.error('Error creating prices table:', err);
    });
}

module.exports = db;
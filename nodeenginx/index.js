const express = require('express');
const mysql = require('mysql2');
const util = require('util');
const waitOn = require('wait-on');

const app = express();
const port = 3000;

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodenginx',
    port: 3306
};

const connection = mysql.createConnection(config);
const query = util.promisify(connection.query).bind(connection);

async function initializeDatabase() {
    try {
        await query('CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL)');
        console.log('Database initialized and default data inserted.');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

app.get("/", async (req, res) => {
    try {
        await query("INSERT IGNORE INTO people(name) VALUES('Luiz')")
        const results = await query('SELECT * FROM people');
        const namesList = results.map(person => `<li>${person.name}</li>`).join('');
        res.send(`
            <h1>Full Cycle Rocks!</h1>
            <ul>${namesList}</ul>
        `);
    } catch (err) {
        console.error('Error executing SELECT query:', err);
        res.status(500).send('Error retrieving data from the database');
    }
});

app.listen(port, async () => {
    console.log(`App is running on port ${port}`);
    await initializeDatabase();
});
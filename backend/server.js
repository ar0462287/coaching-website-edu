require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// MySQL Connection Pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Route to serve HTML files and inject partials
app.get('/:page', (req, res) => {
    const page = req.params.page;
    if (page === 'index.html' || page === 'about.html' || page === 'courses.html' || page === 'testimonials.html' || page === 'contact.html') {
        let filePath = path.join(__dirname, '..\', page);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(404).send('Page not found');
            }
            // Inject navbar and footer
            fs.readFile(path.join(__dirname, '..\', 'navbar.html'), 'utf8', (err, navbarData) => {
                if (err) return res.status(500).send('Error loading navbar');
                fs.readFile(path.join(__dirname, '..\', 'footer.html'), 'utf8', (err, footerData) => {
                    if (err) return res.status(500).send('Error loading footer');
                    let content = data.replace('<div data-include="navbar.html"></div>', navbarData);
                    content = content.replace('<div data-include="footer.html"></div>', footerData);
                    res.send(content);
                });
            });
        });
    } else {
        res.sendFile(path.join(__dirname, '..\', req.params.page));
    }
});

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// API endpoint for contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'INSERT INTO contact_submissions (name, email, phone, message) VALUES (?, ?, ?, ?)';
    pool.query(query, [name, email, phone, message], (error, results) => {
        if (error) {
            console.error('Error saving contact form submission:', error);
            return res.status(500).json({ message: 'Failed to submit form. Please try again later.' });
        }
        res.status(200).json({ message: 'Message sent successfully! We will contact you soon.' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

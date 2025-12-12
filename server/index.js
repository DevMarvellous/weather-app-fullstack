// server/index.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;

// Middleware
app.use(cors()); // Enable CORS for all routes

// A simple welcome route
app.get('/', (req, res) => {
    res.send('Weather API Backend is running!');
});

// The main weather data route: /api/weather/:city
app.get('/api/weather/:city', async (req, res) => {
    const city = req.params.city;
    // The correct URL structure for city name search
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);
        // Send data back to the frontend
        res.json(response.data);
    } catch (error) {
        // Log the actual error details to the TERMINAL for debugging
        console.error("--- Error Details in Terminal ---");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
            res.status(error.response.status).json({ message: error.response.data.message });
        } else {
            console.error("Network or request setup error:", error.message);
            res.status(500).json({ message: 'Error fetching weather data due to network issue or invalid key.' });
        }
        console.error("---------------------------------");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

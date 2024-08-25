const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/bfhl', (req, res) => {
    try {
        const { data = [], user_id, email, roll_number } = req.body;

        if (!Array.isArray(data)) {
            throw new Error('Data must be an array');
        }

        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => /^[A-Za-z]+$/.test(item));
        const lowercaseAlphabets = alphabets.filter(char => char === char.toLowerCase());
        const highestLowercaseAlphabet = lowercaseAlphabets.sort().pop() || null;

        const response = {
            is_success: true,
            user_id: user_id || "unknown_user",
            email: email || "unknown_email",
            roll_number: roll_number || "unknown_roll_number",
            numbers,
            alphabets,
            highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : []
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ is_success: false, message: error.message });
    }
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

module.exports.handler = serverless(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

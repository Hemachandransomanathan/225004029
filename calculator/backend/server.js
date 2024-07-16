const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
let numbers = [];

// Middleware to parse JSON bodies
app.use(express.json());

// Function to fetch numbers from third-party server based on ID
async function fetchNumbers(id) {
    try {
        const response = await axios.get(http://third-party-server/api/${id});
        if (response.status !== 200) {
            throw new Error('Failed to fetch numbers');
        }
        return response.data.numbers;
    } catch (error) {
        console.error(Error fetching numbers for ID '${id}':, error.message);
        throw error;
    }
}

// Route to handle incoming requests for different types of numbers
app.get('/numbers/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch numbers from third-party server based on ID
        const newNumbers = await fetchNumbers(id);

        // Ensure numbers are unique and within window size
        newNumbers.forEach(num => {
            if (!numbers.includes(num)) {
                numbers.push(num);
                if (numbers.length > WINDOW_SIZE) {
                    numbers.shift(); // Remove oldest number if exceeding window size
                }
            }
        });

        // Calculate average of numbers matching window size
        let sum = 0;
        const windowNumbers = numbers.slice(-WINDOW_SIZE); // Get last WINDOW_SIZE numbers
        windowNumbers.forEach(num => sum += num);
        const average = sum / windowNumbers.length;

        // Respond with numbers before and after the latest API call, and the average
        res.json({
            numbers: windowNumbers,
            average: average
        });
    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(Server is running on http://localhost:${PORT});
});
 
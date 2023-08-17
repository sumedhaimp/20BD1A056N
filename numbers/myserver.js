const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 8008;

// Define the route for handling the /numbers endpoint
app.get("/numbers", async (req, res) => {
  const { urls } = req.query;

  // Check if the 'urls' parameter is missing
  if (!urls) {
    return res.status(400).json({ error: "Missing URLs parameter" });
  }

  // Convert the 'urls' parameter into an array, even if it's a single URL
  const urlsArray = Array.isArray(urls) ? urls : [urls];
  const uniqueNumbers = new Set();

  // Function to fetch data from a given URL
  const fetchData = async (uri) => {
    try {
      // Fetch data from the URL with a timeout of 500 milliseconds
      const response = await axios.get(uri, { timeout: 500 });
      const numbers = response.data.numbers || [];

      // Add each number to the set to ensure uniqueness
      numbers.forEach((number) => uniqueNumbers.add(number));
    } catch (error) {
      console.error(`Failed to fetch data from ${uri}: ${error.message}`);
    }
  };

  // Fetch data from all URLs in parallel using Promise.all
  await Promise.all(urlsArray.map(fetchData));

  // Convert the set of unique numbers into a sorted array
  const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);

  // Return the sorted and merged numbers as a response
  res.json({ numbers: sortedNumbers });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

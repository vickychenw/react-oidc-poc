//BFF entrypoint

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001; // or any other port you prefer

app.use(cors());//to handle Cross-Origin Resource Sharing

app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon/ditto'); // Replace with your actual API endpoint
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`BFF server is running on http://localhost:${PORT}`);
});

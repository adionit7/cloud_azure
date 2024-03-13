const express = require('express');
const path = require('path');
const { CosmosClient } = require('@azure/cosmos');

const app = express();
const port = 3000;

// Initialize CosmosDB client
const endpoint = 'https://adityasharmaiitd.documents.azure.com:443/';
const key = '0beIhevj8CGs2BcMPEfJ26ccaN3YML5M3MrLtpAejayUMdZWnZWzpbw2UQ97wf46FpxdnBiiZiThACDbddM3WA==';
const client = new CosmosClient({ endpoint, key });
const databaseId = 'assig1';
const containerId = 'products';

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(express.json());

// Define schema for product documents
const productSchema = {
  id: '/Product',
  type: 'object',
  properties: {
    productId: { type: 'string' },
    name: { type: 'string' },
    price: { type: 'number' },
    description: { type: 'string' }
  },
  required: ['productId', 'name', 'price', 'description']
};

// Route to add new product
app.post('/products', async (req, res) => {
  try {
    const { productId, name, price, description } = req.body;

    // Validate request body
    if (!productId || !name || !price || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const container = client.database(databaseId).container(containerId);

    // Create new product document
    const { resource: createdItem } = await container.items.create({
      productId,
      name,
      price,
      description
    });

    res.status(201).json(createdItem);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to list all products
app.get('/products', async (req, res) => {
  try {
    const container = client.database(databaseId).container(containerId);
    const { resources: products } = await container.items.readAll().fetchAll();

    res.json(products);
  } catch (error) {
    console.error('Error listing products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

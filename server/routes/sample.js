const express = require('express');
const router = express.Router();

// Some sample endpoints to demonstrate the audit logging
// These are just for testing - in a real app you'd have your actual business logic here

// Simulated users data
const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' }
];

// Simulated products
const products = [
    { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
    { id: 2, name: 'Headphones', price: 149.99, category: 'Electronics' },
    { id: 3, name: 'Coffee Mug', price: 12.99, category: 'Kitchen' }
];

// GET /api/sample/users
router.get('/users', (req, res) => {
    res.json({ success: true, data: users });
});

// GET /api/sample/users/:id
router.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
});

// POST /api/sample/users
router.post('/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        ...req.body
    };
    users.push(newUser);
    res.status(201).json({ success: true, data: newUser });
});

// GET /api/sample/products
router.get('/products', (req, res) => {
    const { category } = req.query;
    let result = products;

    if (category) {
        result = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    res.json({ success: true, data: result });
});

// GET /api/sample/products/:id
router.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
});

// POST /api/sample/orders
router.post('/orders', (req, res) => {
    // Simulate creating an order
    const order = {
        id: Math.floor(Math.random() * 10000),
        items: req.body.items || [],
        total: req.body.total || 0,
        createdAt: new Date()
    };
    res.status(201).json({ success: true, data: order });
});

// DELETE /api/sample/users/:id
router.delete('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    users.splice(index, 1);
    res.json({ success: true, message: 'User deleted' });
});

module.exports = router;

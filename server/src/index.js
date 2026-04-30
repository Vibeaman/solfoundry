require('dotenv').config();
const express = require('express');
const cors = require('cors');

const ideasRouter = require('./routes/ideas');
const buildersRouter = require('./routes/builders');
const bidsRouter = require('./routes/bids');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ideas', ideasRouter);
app.use('/api/builders', buildersRouter);
app.use('/api/bids', bidsRouter);
app.use('/api/users', usersRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`SolFoundry API running on port ${PORT}`);
});

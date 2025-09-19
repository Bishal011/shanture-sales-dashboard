const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./db');
const analyticsRoutes = require('./routes/analytics');

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
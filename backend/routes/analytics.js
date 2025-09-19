const express = require('express');
const router = express.Router();
const sequelize = require('../db');
const { QueryTypes } = require('sequelize');

// Revenue by Date
router.get('/revenue-by-date', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = `
      SELECT
        DATE(order_date) AS date,
        SUM(O.quantity * P.price) AS totalRevenue
      FROM Orders AS O
      JOIN Products AS P ON O.product_id = P.id
      WHERE O.order_date BETWEEN :startDate AND :endDate
      GROUP BY date
      ORDER BY date;
    `;
    const results = await sequelize.query(query, {
      replacements: { startDate, endDate },
      type: QueryTypes.SELECT,
    });
    res.json(results);
  } catch (error) {
    console.error('Error fetching revenue by date:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Top Selling Products
router.get('/top-selling-products', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = `
      SELECT
        P.name AS productName,
        SUM(O.quantity) AS totalSales
      FROM Orders AS O
      JOIN Products AS P ON O.product_id = P.id
      WHERE O.order_date BETWEEN :startDate AND :endDate
      GROUP BY P.name
      ORDER BY totalSales DESC
      LIMIT 5;
    `;
    const results = await sequelize.query(query, {
      replacements: { startDate, endDate },
      type: QueryTypes.SELECT,
    });
    res.json(results);
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Sales by Region
router.get('/region-sales', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = `
      SELECT
        C.region,
        SUM(O.quantity) AS totalOrders,
        SUM(O.quantity * P.price) AS totalRevenue
      FROM Orders AS O
      JOIN Customers AS C ON O.customer_id = C.id
      JOIN Products AS P ON O.product_id = P.id
      WHERE O.order_date BETWEEN :startDate AND :endDate
      GROUP BY C.region
      ORDER BY totalRevenue DESC;
    `;
    const results = await sequelize.query(query, {
      replacements: { startDate, endDate },
      type: QueryTypes.SELECT,
    });
    res.json(results);
  } catch (error) {
    console.error('Error fetching region sales:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
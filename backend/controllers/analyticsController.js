const sequelize = require('../db');
const { Op } = require('sequelize');

exports.getRevenueByDate = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Start date and end date are required.' });
  }

  try {
    const results = await sequelize.query(`
      SELECT
          DATE(O.order_date) AS date,
          SUM(O.quantity * P.price) AS totalRevenue
      FROM
          Orders AS O
      JOIN
          Products AS P ON O.product_id = P.id
      WHERE
          O.order_date BETWEEN :startDate AND :endDate
      GROUP BY
          date
      ORDER BY
          date;
    `, {
      replacements: { startDate, endDate },
      type: sequelize.QueryTypes.SELECT,
    });

    res.json(results);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to retrieve revenue data.' });
  }
};
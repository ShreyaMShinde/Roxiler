const pool = require('../config/db');

const getOwnerDashboard = async (req, res) => {
  const storeId = req.user.id;

  try {
    // 1. Get average rating and total ratings count
    const [[ratingStats]] = await pool.query(
      'SELECT COALESCE(AVG(rating), 0) as averageRating, COUNT(rating) as totalRatings FROM ratings WHERE store_id = ?',
      [storeId]
    );

    // 2. Get list of users who submitted ratings
    const [raters] = await pool.query(
      `SELECT u.name, u.email, u.address, r.rating, r.updated_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.updated_at DESC`,
      [storeId]
    );

    res.status(200).json({
      averageRating: parseFloat(ratingStats.averageRating).toFixed(1),
      totalRatings: ratingStats.totalRatings,
      raters,
    });
  } catch (error) {
    console.error('Error fetching owner dashboard stats:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard details.' });
  }
};

module.exports = {
  getOwnerDashboard,
};

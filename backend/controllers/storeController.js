const pool = require('../config/db');

const getStoresForUser = async (req, res) => {
  const userId = req.user.id;
  const { name, address } = req.query;

  try {
    let query = `
      SELECT u.id, u.name, u.email, u.address,
             COALESCE(avg_r.rating, 0) as rating,
             my_r.rating as user_rating
      FROM users u
      LEFT JOIN (
        SELECT store_id, AVG(rating) as rating
        FROM ratings
        GROUP BY store_id
      ) avg_r ON u.id = avg_r.store_id
      LEFT JOIN ratings my_r ON u.id = my_r.store_id AND my_r.user_id = ?
      WHERE u.role = 'Store Owner'
    `;
    const params = [userId];

    if (name) {
      query += ' AND u.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (address) {
      query += ' AND u.address LIKE ?';
      params.push(`%${address}%`);
    }

    query += ' GROUP BY u.id';

    const [stores] = await pool.query(query, params);
    res.status(200).json(stores);
  } catch (error) {
    console.error('Error fetching stores for user:', error);
    res.status(500).json({ message: 'Server error while fetching stores.' });
  }
};

module.exports = {
  getStoresForUser,
};

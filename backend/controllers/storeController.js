const pool = require('../config/db');

const getStoresForUser = async (req, res) => {
  const userId = req.user.id;
  const { name, address } = req.query;

  try {
    let query = `
      SELECT u.id, u.name, u.email, u.address,
             COALESCE(avg_r.rating, 0) as rating,
             COALESCE(avg_r.ratings_count, 0) as ratings_count,
             my_r.rating as user_rating
      FROM users u
      LEFT JOIN (
        SELECT store_id, AVG(rating) as rating, COUNT(rating) as ratings_count
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

const getStoreById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const query = `
      SELECT u.id, u.name, u.email, u.address,
             COALESCE(avg_r.rating, 0) as rating,
             COALESCE(avg_r.ratings_count, 0) as ratings_count,
             my_r.rating as user_rating,
             my_r.comment as user_comment
      FROM users u
      LEFT JOIN (
        SELECT store_id, AVG(rating) as rating, COUNT(rating) as ratings_count
        FROM ratings
        GROUP BY store_id
      ) avg_r ON u.id = avg_r.store_id
      LEFT JOIN ratings my_r ON u.id = my_r.store_id AND my_r.user_id = ?
      WHERE u.role = 'Store Owner' AND u.id = ?
    `;
    const [stores] = await pool.query(query, [userId, id]);

    if (stores.length === 0) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    res.status(200).json(stores[0]);
  } catch (error) {
    console.error('Error fetching store by ID:', error);
    res.status(500).json({ message: 'Server error while fetching store details.' });
  }
};

const getStoreReviews = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT r.id, r.rating, r.comment, r.updated_at, u.name as user_name
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
      ORDER BY r.updated_at DESC
    `;
    const [reviews] = await pool.query(query, [id]);
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching store reviews:', error);
    res.status(500).json({ message: 'Server error while fetching store reviews.' });
  }
};

module.exports = {
  getStoresForUser,
  getStoreById,
  getStoreReviews,
};

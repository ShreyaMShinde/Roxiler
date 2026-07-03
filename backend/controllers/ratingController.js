const pool = require('../config/db');

const submitRating = async (req, res) => {
  const userId = req.user.id;
  const { store_id, rating, comment } = req.body;

  // Validate rating value
  const ratingVal = parseInt(rating);
  if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
    return res.status(400).json({ message: 'Rating must be an integer between 1 and 5.' });
  }

  try {
    // Check if store exists and is actually a Store Owner
    const [stores] = await pool.query("SELECT id FROM users WHERE id = ? AND role = 'Store Owner'", [store_id]);
    if (stores.length === 0) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    // Check if already rated
    const [existing] = await pool.query('SELECT id FROM ratings WHERE user_id = ? AND store_id = ?', [userId, store_id]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'You have already rated this store. Please update your existing rating instead.' });
    }

    // Insert new rating
    await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, store_id, ratingVal, comment || null]
    );

    res.status(201).json({ message: 'Rating submitted successfully!' });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Server error while submitting rating.' });
  }
};

const modifyRating = async (req, res) => {
  const userId = req.user.id;
  const { store_id, rating, comment } = req.body;

  // Validate rating value
  const ratingVal = parseInt(rating);
  if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
    return res.status(400).json({ message: 'Rating must be an integer between 1 and 5.' });
  }

  try {
    // Check if rating exists
    const [existing] = await pool.query('SELECT id FROM ratings WHERE user_id = ? AND store_id = ?', [userId, store_id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'No rating found to modify.' });
    }

    // Update rating
    await pool.query(
      'UPDATE ratings SET rating = ?, comment = ? WHERE user_id = ? AND store_id = ?',
      [ratingVal, comment !== undefined ? comment : null, userId, store_id]
    );

    res.status(200).json({ message: 'Rating modified successfully!' });
  } catch (error) {
    console.error('Modify rating error:', error);
    res.status(500).json({ message: 'Server error while modifying rating.' });
  }
};

module.exports = {
  submitRating,
  modifyRating,
};

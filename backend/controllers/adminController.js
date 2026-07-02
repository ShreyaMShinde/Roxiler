const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const getStats = async (req, res) => {
  try {
    const [[usersResult]] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role IN ('Normal User', 'System Administrator')");
    const [[storesResult]] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'Store Owner'");
    const [[ratingsResult]] = await pool.query("SELECT COUNT(*) as count FROM ratings");

    res.status(200).json({
      totalUsers: usersResult.count,
      totalStores: storesResult.count,
      totalRatings: ratingsResult.count,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error while fetching stats.' });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ message: `${role} added successfully!` });
  } catch (error) {
    console.error('Error creating user by admin:', error);
    res.status(500).json({ message: 'Server error while creating user.' });
  }
};

const getUsersList = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    let query = "SELECT id, name, email, address, role FROM users WHERE role != 'Store Owner'";
    const params = [];

    if (name) {
      query += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      query += ' AND email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      query += ' AND address LIKE ?';
      params.push(`%${address}%`);
    }
    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    const [users] = await pool.query(query, params);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ message: 'Server error while listing users.' });
  }
};

const getStoresList = async (req, res) => {
  try {
    const { name, email, address } = req.query;
    let baseQuery = `
      SELECT u.id, u.name, u.email, u.address, COALESCE(AVG(r.rating), 0) as rating
      FROM users u
      LEFT JOIN ratings r ON u.id = r.store_id
      WHERE u.role = 'Store Owner'
    `;
    const params = [];

    if (name) {
      baseQuery += ' AND u.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      baseQuery += ' AND u.email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      baseQuery += ' AND u.address LIKE ?';
      params.push(`%${address}%`);
    }

    baseQuery += ' GROUP BY u.id';

    const [stores] = await pool.query(baseQuery, params);
    res.status(200).json(stores);
  } catch (error) {
    console.error('Error listing stores:', error);
    res.status(500).json({ message: 'Server error while listing stores.' });
  }
};

const getAllUsersDetails = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    let baseQuery = `
      SELECT u.id, u.name, u.email, u.address, u.role, COALESCE(avg_r.rating, NULL) as rating
      FROM users u
      LEFT JOIN (
        SELECT store_id, AVG(rating) as rating
        FROM ratings
        GROUP BY store_id
      ) avg_r ON u.id = avg_r.store_id
      WHERE 1=1
    `;
    const params = [];

    if (name) {
      baseQuery += ' AND u.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      baseQuery += ' AND u.email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      baseQuery += ' AND u.address LIKE ?';
      params.push(`%${address}%`);
    }
    if (role) {
      baseQuery += ' AND u.role = ?';
      params.push(role);
    }

    const [users] = await pool.query(baseQuery, params);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting detailed user list:', error);
    res.status(500).json({ message: 'Server error while fetching all user details.' });
  }
};

module.exports = {
  getStats,
  createUser,
  getUsersList,
  getStoresList,
  getAllUsersDetails,
};

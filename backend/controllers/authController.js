const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
  const { name, email, address, password, role } = req.body;

  // Default to Normal User if role is not supplied
  const signupRole = role || 'Normal User';
  const finalAddress = address ? address.trim() : '';

  try {
    // Check if user already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user with selected role
    await pool.query(
      'INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, finalAddress, hashedPassword, signupRole]
    );

    res.status(201).json({ message: `${signupRole} registered successfully!` });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = users[0];

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'super_secret_cafe_ratings_jwt_secret_key_123',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

const firebaseLogin = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user details in MySQL based on their Firebase email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'No registered user profile found with this email. Please sign up first.' });
    }

    const user = users[0];

    // Generate a local JWT token for API authorization
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'super_secret_cafe_ratings_jwt_secret_key_123',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Firebase login error:', error);
    res.status(500).json({ message: 'Server error during Firebase credentials syncing.' });
  }
};

const updatePassword = async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error while updating password.' });
  }
};

module.exports = {
  register,
  login,
  firebaseLogin,
  updatePassword,
};

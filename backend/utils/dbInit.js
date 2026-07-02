const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbInit = async () => {
  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Root@123',
  };

  try {
    // 1. Connect without database to create it if it doesn't exist
    const connection = await mysql.createConnection(connectionConfig);
    console.log('Successfully connected to MySQL server for initialization.');

    const dbName = process.env.DB_NAME || 'cafe_rating_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database "${dbName}" ensured.`);
    await connection.end();

    // 2. Connect with database to create tables
    const dbConnection = await mysql.createConnection({
      ...connectionConfig,
      database: dbName,
    });

    console.log('Connected to target database. Initializing tables...');

    // Users table
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(400) NOT NULL,
        role ENUM('System Administrator', 'Normal User', 'Store Owner') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('Users table ensured.');

    // Ratings table
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        store_id INT NOT NULL,
        rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (store_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY user_store_unique (user_id, store_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('Ratings table ensured.');

    // 3. Seed users if users table is empty
    const [rows] = await dbConnection.query('SELECT COUNT(*) as count FROM users');
    if (rows[0].count === 0) {
      console.log('Database empty. Seeding initial users...');

      const defaultPassword = 'Password@123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      const usersToSeed = [
        {
          name: 'System Admin Account Main',
          email: 'admin@caferatings.com',
          password: hashedPassword,
          address: '123 Admin Head Quarters Central Street',
          role: 'System Administrator'
        },
        {
          name: 'The Daily Grind Espresso Bar',
          email: 'dailygrind@cafe.com',
          password: hashedPassword,
          address: '456 Coffee Bean Lane, Seattle, WA',
          role: 'Store Owner'
        },
        {
          name: 'Blue Bottle Coffee Roasters',
          email: 'bluebottle@cafe.com',
          password: hashedPassword,
          address: '789 Latte Boulevard, San Francisco, CA',
          role: 'Store Owner'
        },
        {
          name: 'Alice Wonderland Tester',
          email: 'alice@gmail.com',
          password: hashedPassword,
          address: '101 Wonderland Ave, Fantasy Land',
          role: 'Normal User'
        },
        {
          name: 'Bob Builder Constructor',
          email: 'bob@gmail.com',
          password: hashedPassword,
          address: '202 Building Blocks Rd, Construction City',
          role: 'Normal User'
        }
      ];

      for (const u of usersToSeed) {
        await dbConnection.query(
          'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
          [u.name, u.email, u.password, u.address, u.role]
        );
      }
      console.log('Seeding completed successfully!');
    } else {
      console.log('Database already has users. Skipping seed.');
    }

    await dbConnection.end();
    console.log('Database initialization and verification completed.');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
};

module.exports = dbInit;

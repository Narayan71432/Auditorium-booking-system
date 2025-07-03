const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

async function seedUsers() {
  try {
    // Connect to MongoDB
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Drop the entire collection if it exists
    try {
      await connection.connection.db.dropCollection('users');
      console.log('Dropped existing users collection');
    } catch (error) {
      if (error.code !== 26) { // Only log if error is not "namespace not found"
        console.log('Error dropping collection:', error);
      }
    }

    // Hash passwords
    const userSalt = await bcrypt.genSalt(10);
    const adminSalt = await bcrypt.genSalt(10);

    const userPassword = await bcrypt.hash('userpassword', userSalt);
    const adminPassword = await bcrypt.hash('adminpassword', adminSalt);

    // Recreate the collection with desired schema
    await connection.connection.db.createCollection('users');

    // Create user
    await User.create({
      username: 'user',
      email: 'user@example.com',
      password: userPassword,
      role: 'user'
    });

    // Create admin
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });

    const seededUsers = await User.find({});
    console.log('Users seeded successfully');
    console.log('Seeded Users:');
    seededUsers.forEach(user => {
      console.log(`Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

seedUsers();

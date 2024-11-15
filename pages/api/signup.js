import connectDB from '@/lib/connectDB';
import User from '@/models/User';
const bcrypt = require('bcryptjs');

export default async function signup(req, res) {
  if (req.method === 'POST') {
    await connectDB();

    let { name, email, password, authType } = req.body;
    email = email.replace(/\s+/g, '').toLowerCase();

    try {
      if (!name || !email || !password) {
        return res.send('Name, Email and Password are required');
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.send('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword, authType });
      await newUser.save();

      return res.send('Registered successfully');
    } catch (error) {
      return res.send('Cannot register user');
    }
  }
};
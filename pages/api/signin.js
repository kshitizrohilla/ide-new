const connectDB = require('@/lib/connectDB');
const User = require('@/models/User');
const bcrypt = require('bcryptjs');

export default async function signin(req, res) {
  if (req.method === 'POST') {
    await connectDB();

    let { email, password } = req.body;
    email = email.replace(/\s+/g, '').toLowerCase();

    try {
      if (!email || !password) {
        return res.send('Email and Password are required');
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.send('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.send('Invalid email or password');
      }

      return res.send('Sign in successful');
    } catch (error) {
      return res.send('Cannot sign in user');
    }
  }
};
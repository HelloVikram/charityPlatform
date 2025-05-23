const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  const { name, email, password, user_type } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const saltRound = 10;
    const hashed = await bcrypt.hash(password, saltRound);

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      user_type,
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id, user_type: user.user_type }, process.env.JWT_SECRET);

    res.status(200).json({ token, user: { id: user.id, name: user.name, user_type: user.user_type } });
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
};

const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const user = req.user; 

  try {
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = 10;
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err });
  }
};



module.exports = { register, login ,updateProfile };
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.create(email, password);
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

exports.findUserByEmail = async (req, res) => {
    const email = req.params.email;
    try {
        const user = await User.findByEmail(email);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'Error finding user', error: error.message });
    }
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        /* const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        } */

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            user: { id: user._id, name: user.username, email: user.email },
            token
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const logout = async (req, res) => {
    try {
        // If you're using cookies:
        res.clearCookie && res.clearCookie('token', { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production' 
        });

        // Client-side should also remove token stored in localStorage/clientside storage.
        return res.status(200).json({ message: 'Logged out successfully.' });
    } catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    login,
    logout
};
const express = require('express');
const bcrypt = require('bcryptjs');//ma hoa password
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password, role, email } = req.body;
    try {
        //const hashedPassword = await bcrypt.hash(password, 10);
        //const user = new User({ username, password: hashedPassword, role, email });
        const user = new User({ username, password, role, email });
        await user.save();
        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(password == user.password)/*(await bcrypt.compare(password, user.password))*/) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30m' });
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
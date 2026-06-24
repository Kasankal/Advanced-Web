const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth, redirectIfAuth } = require('../middleware/auth');
const { renderLogin, renderRegister, renderDashboard } = require('../views/render');

router.get('/', (req, res) => res.redirect('/login'));

router.get('/register', redirectIfAuth, (req, res) => {
  const flash = req.session.flash || null;
  req.session.flash = null;
  res.send(renderRegister(flash));
});

router.post('/register', redirectIfAuth, async (req, res) => {
  const { fullName, studentId, email, course, year, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    req.session.flash = { error: 'Passwords do not match.' };
    return res.redirect('/register');
  }
  try {
    const existing = await User.findOne({ $or: [{ email }, { studentId }] });
    if (existing) {
      req.session.flash = { error: 'A student with that email or student ID already exists.' };
      return res.redirect('/register');
    }
    await User.create({ fullName, studentId, email, course, year: parseInt(year), password });
    req.session.flash = { success: 'Account created. You can now log in.' };
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.session.flash = { error: 'Registration failed. Please try again.' };
    res.redirect('/register');
  }
});

router.get('/login', redirectIfAuth, (req, res) => {
  const flash = req.session.flash || null;
  req.session.flash = null;
  res.send(renderLogin(flash));
});

router.post('/login', redirectIfAuth, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.session.flash = { error: 'Invalid email or password.' };
      return res.redirect('/login');
    }
    req.session.userId = user._id.toString();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.session.flash = { error: 'Login failed. Please try again.' };
    res.redirect('/login');
  }
});

router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).lean();
    res.send(renderDashboard(user));
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;

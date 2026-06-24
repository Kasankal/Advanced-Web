const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { requireAuth, redirectIfAuth } = require('../middleware/auth');
const { renderLogin, renderRegister, renderDashboard, renderProfile } = require('../views/render');

router.get('/', (req, res) => res.redirect('/login'));

// Register
router.get('/register', redirectIfAuth, (req, res) => {
  const flash = req.session.flash || null;
  req.session.flash = null;
  res.send(renderRegister(flash));
});

router.post('/register', redirectIfAuth, async (req, res) => {
  const { fullName, employeeId, email, department, role, phone, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.session.flash = { error: 'Passwords do not match.' };
    return res.redirect('/register');
  }

  try {
    const existing = await Employee.findOne({ $or: [{ email }, { employeeId }] });
    if (existing) {
      req.session.flash = { error: 'An employee with that email or employee ID already exists.' };
      return res.redirect('/register');
    }

    await Employee.create({ fullName, employeeId, email, department, role, phone, password });
    req.session.flash = { success: 'Account created. You can now log in.' };
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.session.flash = { error: 'Registration failed. Please try again.' };
    res.redirect('/register');
  }
});

// Login
router.get('/login', redirectIfAuth, (req, res) => {
  const flash = req.session.flash || null;
  req.session.flash = null;
  res.send(renderLogin(flash));
});

router.post('/login', redirectIfAuth, async (req, res) => {
  const { email, password } = req.body;
  try {
    const employee = await Employee.findOne({ email });
    if (!employee || !(await employee.comparePassword(password))) {
      req.session.flash = { error: 'Invalid email or password.' };
      return res.redirect('/login');
    }
    req.session.employeeId = employee._id.toString();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.session.flash = { error: 'Login failed. Please try again.' };
    res.redirect('/login');
  }
});

// Dashboard (protected)
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.session.employeeId).lean();
    res.send(renderDashboard(employee));
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

// Edit Profile (protected)
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.session.employeeId).lean();
    const flash = req.session.flash || null;
    req.session.flash = null;
    res.send(renderProfile(employee, flash));
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

router.post('/profile', requireAuth, async (req, res) => {
  const { fullName, phone, department, role } = req.body;
  try {
    await Employee.findByIdAndUpdate(req.session.employeeId, { fullName, phone, department, role });
    req.session.flash = { success: 'Profile updated.' };
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.session.flash = { error: 'Update failed. Please try again.' };
    res.redirect('/profile');
  }
});

// Logout
router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;

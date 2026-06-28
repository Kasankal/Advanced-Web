const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'emp_secret_2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // 1 hour
}));

mongoose.connect('mongodb://localhost:27017/employee_records')
  .then(() => console.log('MongoDB connected: employee_records'))
  .catch(err => console.error('MongoDB error:', err));

// ── Schemas ──────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['admin', 'hr'], default: 'hr' }
});
const User = mongoose.model('User', userSchema);

const employeeSchema = new mongoose.Schema({
  empId:      { type: String, required: true, unique: true },
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  phone:      { type: String },
  department: { type: String, required: true, enum: ['IT','HR','Finance','Marketing','Operations','Sales','Engineering','Other'] },
  position:   { type: String, required: true },
  salary:     { type: Number, min: 0 },
  hireDate:   { type: Date, required: true },
  status:     { type: String, enum: ['Active', 'On Leave', 'Terminated'], default: 'Active' },
  createdAt:  { type: Date, default: Date.now }
});
const Employee = mongoose.model('Employee', employeeSchema);

// ── Auth Middleware ───────────────────────────────────────────
function requireAuth(req, res, next) {
  if (req.session.userId) return next();
  res.status(401).json({ success: false, error: 'Unauthorized. Please log in.' });
}

// ── Seed default admin on first run ──────────────────────────
async function seedAdmin() {
  const exists = await User.findOne({ username: 'admin' });
  if (!exists) {
    const hash = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', password: hash, role: 'admin' });
    console.log('Default admin created — username: admin, password: admin123');
  }
}
seedAdmin();

// ── Auth Routes ───────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ success: false, error: 'Username and password required.' });
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials.' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ success: false, error: 'Invalid credentials.' });
  req.session.userId = user._id;
  req.session.username = user.username;
  req.session.role = user.role;
  res.json({ success: true, username: user.username, role: user.role });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out.' });
});

app.get('/api/auth/me', (req, res) => {
  if (req.session.userId)
    return res.json({ success: true, username: req.session.username, role: req.session.role });
  res.json({ success: false });
});

app.post('/api/auth/register', requireAuth, async (req, res) => {
  if (req.session.role !== 'admin')
    return res.status(403).json({ success: false, error: 'Only admin can create users.' });
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ username: req.body.username, password: hash, role: req.body.role || 'hr' });
    res.json({ success: true, data: { username: user.username, role: user.role } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ── Employee CRUD ─────────────────────────────────────────────

// CREATE
app.post('/api/employees', requireAuth, async (req, res) => {
  try {
    const emp = new Employee(req.body);
    await emp.save();
    res.status(201).json({ success: true, data: emp });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// READ ALL (with search + filter)
app.get('/api/employees', requireAuth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      const rx = new RegExp(req.query.search, 'i');
      filter.$or = [{ firstName: rx }, { lastName: rx }, { email: rx }, { empId: rx }, { position: rx }];
    }
    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: employees.length, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// READ ONE
app.get('/api/employees/:id', requireAuth, async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ success: false, error: 'Employee not found' });
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE
app.put('/api/employees/:id', requireAuth, async (req, res) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!emp) return res.status(404).json({ success: false, error: 'Employee not found' });
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE
app.delete('/api/employees/:id', requireAuth, async (req, res) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (!emp) return res.status(404).json({ success: false, error: 'Employee not found' });
    res.json({ success: true, message: 'Employee deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3003;
app.listen(PORT, () => console.log(`Task 3 - Employee Records running on http://localhost:${PORT}`));

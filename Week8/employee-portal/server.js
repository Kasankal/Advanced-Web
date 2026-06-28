const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'employee-portal-secret-change-in-prod',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 hours (work day)
}));

app.use('/', require('./routes/index'));

app.listen(PORT, () => console.log(`Employee Portal running on http://localhost:${PORT}`));

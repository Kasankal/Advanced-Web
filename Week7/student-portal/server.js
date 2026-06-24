const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'student-portal-secret-change-in-prod',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 hours
}));

app.use('/', require('./routes/index'));

app.listen(PORT, () => console.log(`Student Portal running on http://localhost:${PORT}`));

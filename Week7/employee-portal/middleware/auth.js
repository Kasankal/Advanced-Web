function requireAuth(req, res, next) {
  if (req.session && req.session.employeeId) return next();
  req.session.flash = { error: 'You must be logged in to access that page.' };
  res.redirect('/login');
}

function redirectIfAuth(req, res, next) {
  if (req.session && req.session.employeeId) return res.redirect('/dashboard');
  next();
}

module.exports = { requireAuth, redirectIfAuth };

const { layout, escHtml, flashHtml } = require('./template');

function renderLogin(flash) {
  const content = `
    <h1>Student Login</h1>
    ${flashHtml(flash)}
    <form method="POST" action="/login">
      <div class="form-group">
        <label for="email">Email address</label>
        <input type="email" id="email" name="email" required autocomplete="email">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required autocomplete="current-password">
      </div>
      <button type="submit">Log in</button>
    </form>
    <p class="form-footer">No account? <a href="/register">Register</a></p>
  `;
  return layout('Login', content);
}

function renderRegister(flash) {
  const content = `
    <h1>Student Registration</h1>
    ${flashHtml(flash)}
    <form method="POST" action="/register">
      <div class="form-group">
        <label for="fullName">Full name</label>
        <input type="text" id="fullName" name="fullName" required>
      </div>
      <div class="form-group">
        <label for="studentId">Student ID</label>
        <input type="text" id="studentId" name="studentId" required placeholder="e.g. MKU/BIT/001/2024">
      </div>
      <div class="form-group">
        <label for="email">Email address</label>
        <input type="email" id="email" name="email" required autocomplete="email">
      </div>
      <div class="form-group">
        <label for="course">Course</label>
        <input type="text" id="course" name="course" required placeholder="e.g. Bachelor of Information Technology">
      </div>
      <div class="form-group">
        <label for="year">Year of study</label>
        <select id="year" name="year" required>
          <option value="">Select year</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
        </select>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required minlength="6" autocomplete="new-password">
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" required autocomplete="new-password">
      </div>
      <button type="submit">Create account</button>
    </form>
    <p class="form-footer">Already registered? <a href="/login">Log in</a></p>
  `;
  return layout('Register', content);
}

function renderDashboard(user) {
  const joined = new Date(user.createdAt).toLocaleDateString('en-KE', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const content = `
    <h1>Dashboard</h1>
    <div class="user-card">
      <h2>Student Profile</h2>
      <table>
        <tr><td>Full name</td><td>${escHtml(user.fullName)}</td></tr>
        <tr><td>Student ID</td><td>${escHtml(user.studentId)}</td></tr>
        <tr><td>Email</td><td>${escHtml(user.email)}</td></tr>
        <tr><td>Course</td><td>${escHtml(user.course)}</td></tr>
        <tr><td>Year of study</td><td>Year ${escHtml(String(user.year))}</td></tr>
        <tr><td>Registered</td><td>${joined}</td></tr>
      </table>
    </div>
    <form method="POST" action="/logout" class="logout-form">
      <button type="submit" class="btn-logout">Log out</button>
    </form>
  `;
  return layout('Dashboard', content, user.fullName);
}

module.exports = { renderLogin, renderRegister, renderDashboard };

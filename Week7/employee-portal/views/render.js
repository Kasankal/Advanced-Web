const { layout, escHtml, flashHtml } = require('./template');

const DEPARTMENTS = ['Engineering', 'Finance', 'Human Resources', 'Marketing', 'Operations', 'Sales', 'IT', 'Legal'];

function renderLogin(flash) {
  const content = `
    <h1>Employee Login</h1>
    ${flashHtml(flash)}
    <form method="POST" action="/login">
      <div class="form-group">
        <label for="email">Work email</label>
        <input type="email" id="email" name="email" required autocomplete="email">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required autocomplete="current-password">
      </div>
      <button type="submit">Log in</button>
    </form>
    <p class="form-footer">New employee? <a href="/register">Register</a></p>
  `;
  return layout('Login', content);
}

function renderRegister(flash) {
  const deptOptions = DEPARTMENTS.map(d =>
    `<option value="${d}">${d}</option>`
  ).join('');

  const content = `
    <h1>Employee Registration</h1>
    ${flashHtml(flash)}
    <form method="POST" action="/register">
      <div class="form-row">
        <div class="form-group">
          <label for="fullName">Full name</label>
          <input type="text" id="fullName" name="fullName" required>
        </div>
        <div class="form-group">
          <label for="employeeId">Employee ID</label>
          <input type="text" id="employeeId" name="employeeId" required placeholder="e.g. EMP-0042">
        </div>
      </div>
      <div class="form-group">
        <label for="email">Work email</label>
        <input type="email" id="email" name="email" required autocomplete="email">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="department">Department</label>
          <select id="department" name="department" required>
            <option value="">Select department</option>
            ${deptOptions}
          </select>
        </div>
        <div class="form-group">
          <label for="role">Job title</label>
          <input type="text" id="role" name="role" required placeholder="e.g. Software Engineer">
        </div>
      </div>
      <div class="form-group">
        <label for="phone">Phone number</label>
        <input type="tel" id="phone" name="phone" placeholder="e.g. +254 700 000 000">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required minlength="6" autocomplete="new-password">
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required autocomplete="new-password">
        </div>
      </div>
      <button type="submit">Create account</button>
    </form>
    <p class="form-footer">Already registered? <a href="/login">Log in</a></p>
  `;
  return layout('Register', content);
}

function renderDashboard(employee) {
  const joined = new Date(employee.createdAt).toLocaleDateString('en-KE', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const content = `
    <h1>Dashboard</h1>
    <div class="nav-links">
      <a href="/dashboard" class="active">Profile</a>
      <a href="/profile">Edit Profile</a>
    </div>

    <div class="section">
      <h2>Personal Information</h2>
      <table>
        <tr><td>Full name</td><td>${escHtml(employee.fullName)}</td></tr>
        <tr><td>Employee ID</td><td>${escHtml(employee.employeeId)}</td></tr>
        <tr><td>Email</td><td>${escHtml(employee.email)}</td></tr>
        <tr><td>Phone</td><td>${escHtml(employee.phone || 'Not set')}</td></tr>
      </table>
    </div>

    <div class="section">
      <h2>Employment Details</h2>
      <table>
        <tr><td>Department</td><td>${escHtml(employee.department)}</td></tr>
        <tr><td>Job title</td><td>${escHtml(employee.role)}</td></tr>
        <tr><td>Registered</td><td>${joined}</td></tr>
      </table>
    </div>

    <form method="POST" action="/logout" class="logout-form">
      <button type="submit" class="btn-logout">Log out</button>
    </form>
  `;
  return layout('Dashboard', content, employee.fullName);
}

function renderProfile(employee, flash) {
  const DEPARTMENTS = ['Engineering', 'Finance', 'Human Resources', 'Marketing', 'Operations', 'Sales', 'IT', 'Legal'];
  const deptOptions = DEPARTMENTS.map(d =>
    `<option value="${d}" ${d === employee.department ? 'selected' : ''}>${d}</option>`
  ).join('');

  const content = `
    <h1>Edit Profile</h1>
    <div class="nav-links">
      <a href="/dashboard">Profile</a>
      <a href="/profile" class="active">Edit Profile</a>
    </div>
    ${flashHtml(flash)}
    <form method="POST" action="/profile">
      <div class="form-group">
        <label for="fullName">Full name</label>
        <input type="text" id="fullName" name="fullName" value="${escHtml(employee.fullName)}" required>
      </div>
      <div class="form-group">
        <label for="phone">Phone number</label>
        <input type="tel" id="phone" name="phone" value="${escHtml(employee.phone || '')}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="department">Department</label>
          <select id="department" name="department" required>
            ${deptOptions}
          </select>
        </div>
        <div class="form-group">
          <label for="role">Job title</label>
          <input type="text" id="role" name="role" value="${escHtml(employee.role)}" required>
        </div>
      </div>
      <button type="submit">Save changes</button>
    </form>
  `;
  return layout('Edit Profile', content, employee.fullName);
}

module.exports = { renderLogin, renderRegister, renderDashboard, renderProfile };

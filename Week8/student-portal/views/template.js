function layout(title, content, user = null) {
  const nav = user
    ? `<span class="nav-user">${escHtml(user)}</span>`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(title)} - Student Portal</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
<div class="page">
  <header>
    <span class="site-name">Student Portal</span>
    ${nav}
  </header>
  <main ${user ? 'class="wide"' : ''}>
    ${content}
  </main>
  <footer>Mount Kenya University &mdash; Student Portal</footer>
</div>
</body>
</html>`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function flashHtml(flash) {
  if (!flash) return '';
  if (flash.error) return `<div class="alert alert-error">${escHtml(flash.error)}</div>`;
  if (flash.success) return `<div class="alert alert-success">${escHtml(flash.success)}</div>`;
  return '';
}

module.exports = { layout, escHtml, flashHtml };

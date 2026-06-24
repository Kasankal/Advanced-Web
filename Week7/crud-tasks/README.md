# CRUD Practical Tasks — MongoDB + Node.js/Express

## Prerequisites
- Node.js installed
- MongoDB running locally on port 27017

## Setup
```bash
cd crud-tasks
npm install
```

## Running Each Task

### Task 1 — Student Management System
```bash
cd task1-students
node server.js
# Open: http://localhost:3001
# Database: student_management
```
**CRUD Operations:**
- POST   /api/students         → Create student
- GET    /api/students         → Read all students
- GET    /api/students/:id     → Read one student
- PUT    /api/students/:id     → Update student
- DELETE /api/students/:id     → Delete student


### Task 2 — Library Book Management System
```bash
cd task2-library
node server.js
# Open: http://localhost:3002
# Database: library_management
```
**CRUD Operations:**
- POST   /api/books            → Add book
- GET    /api/books            → Get all books (supports ?search= and ?category=)
- GET    /api/books/:id        → Get one book
- PUT    /api/books/:id        → Update book
- DELETE /api/books/:id        → Delete book

---

### Task 3 — Employee Records Management System (Challenge)
```bash
cd task3-employees
node server.js
# Open: http://localhost:3003
# Database: employee_records
# Default login: admin / admin123
```
**Auth Routes:**
- POST /api/auth/login         → Login
- POST /api/auth/logout        → Logout
- GET  /api/auth/me            → Check session

**CRUD Operations (all require login):**
- POST   /api/employees        → Register employee
- GET    /api/employees        → Get all (supports ?search= ?department= ?status=)
- GET    /api/employees/:id    → Get one
- PUT    /api/employees/:id    → Update
- DELETE /api/employees/:id    → Delete


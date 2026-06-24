// database/init.js
// Run with: node database/init.js
// Creates indexes and an optional demo employee account.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/employee_portal';

const EmployeeSchema = new mongoose.Schema({
  fullName:   { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  email:      { type: String, required: true, unique: true, lowercase: true },
  department: { type: String, required: true },
  role:       { type: String, required: true },
  phone:      { type: String },
  password:   { type: String, required: true },
  createdAt:  { type: Date, default: Date.now }
});

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to:', MONGO_URI);

  const Employee = mongoose.model('Employee', EmployeeSchema);

  await Employee.createIndexes();
  console.log('Indexes created: email (unique), employeeId (unique)');

  const existing = await Employee.findOne({ email: 'demo@company.com' });
  if (!existing) {
    const password = await bcrypt.hash('Demo@1234', 10);
    await Employee.create({
      fullName:   'Demo Employee',
      employeeId: 'EMP-0001',
      email:      'demo@company.com',
      department: 'IT',
      role:       'Software Engineer',
      phone:      '+254 700 000 000',
      password
    });
    console.log('Demo employee created:');
    console.log('  Email:    demo@company.com');
    console.log('  Password: Demo@1234');
  } else {
    console.log('Demo employee already exists, skipping.');
  }

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });

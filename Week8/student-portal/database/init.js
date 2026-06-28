// database/init.js
// Run with: node database/init.js
// Creates indexes and an optional demo student account.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/student_portal';

const UserSchema = new mongoose.Schema({
  fullName:  { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  course:    { type: String, required: true },
  year:      { type: Number, required: true },
  password:  { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to:', MONGO_URI);

  const User = mongoose.model('User', UserSchema);

  // Ensure indexes exist
  await User.createIndexes();
  console.log('Indexes created: email (unique), studentId (unique)');

  // Insert a demo student (skip if already exists)
  const existing = await User.findOne({ email: 'demo@student.mku.ac.ke' });
  if (!existing) {
    const password = await bcrypt.hash('Demo@1234', 10);
    await User.create({
      fullName:  'Demo Student',
      studentId: 'MKU/DEMO/001/2024',
      email:     'demo@student.mku.ac.ke',
      course:    'Bachelor of Information Technology',
      year:      4,
      password
    });
    console.log('Demo student created:');
    console.log('  Email:    demo@student.mku.ac.ke');
    console.log('  Password: Demo@1234');
  } else {
    console.log('Demo student already exists, skipping.');
  }

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });

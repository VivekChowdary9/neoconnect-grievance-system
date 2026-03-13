const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cron = require('node-cron');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/polls', require('./routes/pollRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));

// Cron: Escalate cases not updated in 7 days
cron.schedule('0 0 * * *', async () => {
  const Case = require('./models/Case');
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  await Case.updateMany(
    {
      status: { $in: ['Assigned', 'In Progress', 'Pending'] },
      updatedAt: { $lt: sevenDaysAgo }
    },
    { $set: { status: 'Escalated' } }
  );
  console.log('Escalation check complete');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`NeoConnect API running on port ${PORT}`));
const express = require("express");
const app = express();

app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { readGroups, writeGroups } from './utils/storage.js';
import { fetchAttendanceData, fetchGroupAttendance } from './utils/attendanceService.js';
import { schemas, validateInput, groupSchema } from './utils/validation.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later' }
});
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));

// Error handler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all groups
app.get('/api/groups', asyncHandler(async (req, res) => {
  const groups = await readGroups();
  res.json(groups);
}));

// Create group
app.post('/api/groups', asyncHandler(async (req, res) => {
  console.log('Create request body:', req.body);
  const validatedData = validateInput(groupSchema, req.body);
  const { name, rollNumbers, campus } = validatedData;

  const groups = await readGroups();
  
  if (groups[name]) {
    return res.status(409).json({ error: 'Group already exists' });
  }

  groups[name] = { rollNumbers, campus };
  await writeGroups(groups);
  
  res.status(201).json({ message: 'Group created successfully', name, rollNumbers, campus });
}));

// Update group
app.put('/api/groups/:name', asyncHandler(async (req, res) => {
  const { name } = req.params;
  console.log('Update request for:', name, 'Body:', req.body);
  const validatedData = validateInput(groupSchema, req.body);
  const { name: newName, rollNumbers, campus } = validatedData;

  const groups = await readGroups();
  
  if (!groups[name]) {
    return res.status(404).json({ error: 'Group not found' });
  }

  if (newName !== name && groups[newName]) {
    return res.status(409).json({ error: 'New group name already exists' });
  }

  delete groups[name];
  groups[newName] = { rollNumbers, campus };
  await writeGroups(groups);
  
  res.json({ message: 'Group updated successfully', name: newName, rollNumbers, campus });
}));

// Delete group
app.delete('/api/groups/:name', asyncHandler(async (req, res) => {
  const { name } = req.params;
  validateInput(schemas.groupName, name);

  const groups = await readGroups();
  
  if (!groups[name]) {
    return res.status(404).json({ error: 'Group not found' });
  }

  delete groups[name];
  await writeGroups(groups);
  
  res.json({ message: 'Group deleted successfully' });
}));

// Get single attendance
app.get('/api/attendance/:roll', asyncHandler(async (req, res) => {
  const { roll } = req.params;
  validateInput(schemas.rollNumber, roll);

  const data = await fetchAttendanceData(roll);
  res.json(data);
}));

// Get group attendance
app.get('/api/groups/:name/attendance', asyncHandler(async (req, res) => {
  const { name } = req.params;
  validateInput(schemas.groupName, name);

  const groups = await readGroups();
  const group = groups[name];
  
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }

  const { rollNumbers, campus } = group;
  const results = await fetchGroupAttendance(rollNumbers, campus);
  res.json(results);
}));

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error.message);
  
  if (error.message.includes('Validation failed')) {
    return res.status(400).json({ error: error.message });
  }
  
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
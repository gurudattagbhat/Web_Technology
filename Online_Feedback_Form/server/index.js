import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import feedbackRoutes from './routes/feedbackRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

let dbStatus = {
  connected: false,
  mode: 'Disconnected',
  uri: '',
};

// Database Connection Handler with Fallback to MongoMemoryServer
async function connectDB() {
  const localURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feedback_db';

  try {
    console.log(`Connecting to primary MongoDB at ${localURI}...`);
    await mongoose.connect(localURI, {
      serverSelectionTimeoutMS: 3000,
    });
    dbStatus = {
      connected: true,
      mode: 'Local / Remote MongoDB',
      uri: localURI,
    };
    console.log('Successfully connected to MongoDB Database!');
  } catch (primaryErr) {
    console.warn(`Primary MongoDB connection failed: ${primaryErr.message}`);
    console.log('Launching in-memory MongoDB instance (mongodb-memory-server)...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();

      await mongoose.connect(memUri);
      dbStatus = {
        connected: true,
        mode: 'In-Memory MongoDB (Zero Config)',
        uri: memUri,
      };
      console.log(`Successfully connected to In-Memory MongoDB at ${memUri}!`);
    } catch (memErr) {
      console.error('Failed to launch Mongo Memory Server:', memErr);
      dbStatus = {
        connected: false,
        mode: 'Connection Failed',
        error: memErr.message,
      };
    }
  }
}

connectDB();

// API Routes
app.use('/api/feedback', feedbackRoutes);

// Status check endpoint
app.get('/api/status', (req, res) => {
  res.status(200).json({
    success: true,
    db: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Serve static files from public and dist folders
const publicPath = path.join(__dirname, '../public');
const distPath = path.join(__dirname, '../dist');
app.use(express.static(publicPath));
app.use(express.static(distPath));

app.get('{*splat}', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const htmlFile = path.join(publicPath, 'feedback.html');
  res.sendFile(htmlFile, (err) => {
    if (err) {
      res.sendFile(path.join(distPath, 'index.html'), (err2) => {
        if (err2) {
          res.status(404).send('Feedback HTML Page or Vite Dev Server is running');
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Feedback Server running on http://localhost:${PORT}`);
});

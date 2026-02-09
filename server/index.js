import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from current directory first, then fallback to root if needed
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const GROQ_API_KEY = (process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || "").trim();

// AI Client Initialization
const aiClient = new OpenAI({
    apiKey: GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

// Verify connection (non-blocking, safe)
if (GROQ_API_KEY) {
    aiClient.models.list()
        .then(() => console.log("✅ Groq API Connection Verified"))
        .catch(err => console.error("⚠️ Groq API Connection Check Failed (Non-fatal):", err.message));
} else {
    console.log("⚠️ Groq API Key missing - AI features will be disabled.");
}

// Middleware
app.use(cors({
    origin: ["https://minddcare.netlify.app", "http://localhost:5173", "http://localhost:8080", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    // If already connected, do nothing
    if (mongoose.connection.readyState === 1) return;

    // If currently connecting, wait for it to finish
    if (mongoose.connection.readyState === 2) {
        return new Promise((resolve, reject) => {
            mongoose.connection.once('connected', resolve);
            mongoose.connection.once('error', reject);
        });
    }

    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables');
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        throw err;
    }
};

// Middleware to ensure DB is connected
const dbMiddleware = async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({
            message: "Database connection failed",
            error: err.message,
            tip: "Check your MongoDB Atlas Network Access (IP Whitelist) and if your URI is correct."
        });
    }
};

// Apply DB middleware to all /api routes
app.use('/api', dbMiddleware);

// Root route for deployment confirmation
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: white;">
            <h1 style="color: #38bdf8;">🧠 MindCare API</h1>
            <p>The backend is successfully running on Vercel!</p>
            <p style="color: #94a3b8;">Health check: <a href="/api/health" style="color: #38bdf8;">/api/health</a></p>
        </div>
    `);
});

// Health check
app.get('/api/health', (req, res) => {
    const state = mongoose.connection.readyState;
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    res.json({
        status: 'ok',
        database: states[state] || 'unknown',
        mongodb_uri_exists: !!process.env.MONGODB_URI,
        env: process.env.NODE_ENV || 'production'
    });
});

// Diagnostic route for DB connection
app.get('/api/test-db', async (req, res) => {
    try {
        if (!process.env.MONGODB_URI) {
            return res.status(500).json({ error: 'MONGODB_URI is missing' });
        }

        // Try a fresh connection test
        const testConn = await mongoose.createConnection(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        }).asPromise();

        await testConn.close();
        res.json({ success: true, message: 'Database is reachable!' });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
            tip: 'Check your MongoDB Atlas Network Access (IP Whitelist) and credentials.'
        });
    }
});

// Schemas
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const journalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    mood: { type: String, required: true },
    content: { type: String, required: true },
    sentiment: {
        score: Number, // 0 to 1
        label: String, // Happy, Calm, Anxious, etc.
        analysis: String
    },
    tags: [String],
    createdAt: { type: Date, default: Date.now }
});

const Journal = mongoose.model('Journal', journalSchema);

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token is invalid or expired' });
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(`Login attempt for: ${email}`);
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            message: "Login failed on server",
            error: error.message,
            state: mongoose.connection.readyState
        });
    }
});

// Protected Journal Routes
app.get('/api/journal', authenticateToken, async (req, res) => {
    try {
        const entries = await Journal.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/journal', authenticateToken, async (req, res) => {
    const { date, mood, content, tags } = req.body;

    let sentiment = { score: 0.5, label: 'Neutral', analysis: 'Analysis skipped' };

    try {
        console.log("Starting AI Analysis for entry...");
        if (!GROQ_API_KEY) {
            console.error("WARNING: GROQ_API_KEY is missing. Skipping analysis.");
        } else {
            const aiResponse = await aiClient.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "Analyze the sentiment of this journal entry. Return ONLY a JSON object with: { score: number (0 to 1, where 1 is very positive), label: string (one word sentiment eg: Joyful, Peaceful, Stressed, Low, Neutral), analysis: string (one short sentence explaining why) }"
                    },
                    {
                        role: "user",
                        content: `Mood: ${mood}. Content: ${content}`
                    }
                ],
                response_format: { type: "json_object" }
            });

            console.log("AI Response received successfully.");
            const result = JSON.parse(aiResponse.choices[0].message.content);
            sentiment = result;
            console.log("Sentiment Result:", sentiment);
        }
    } catch (aiError) {
        console.error("AI Analysis FAILED (Soft Fail). Full Error:", JSON.stringify(aiError, null, 2));
        // Fallback is already set to default
    }

    const newEntry = new Journal({
        userId: req.user.id,
        date,
        mood,
        content,
        sentiment,
        tags
    });

    try {
        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/journal/:id', authenticateToken, async (req, res) => {
    try {
        const entry = await Journal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!entry) return res.status(404).json({ message: 'Entry not found or unauthorized' });
        res.json({ message: 'Entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/journal/:id', authenticateToken, async (req, res) => {
    try {
        const updatedEntry = await Journal.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { content: req.body.content },
            { new: true }
        );
        if (!updatedEntry) return res.status(404).json({ message: 'Entry not found or unauthorized' });
        res.json(updatedEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

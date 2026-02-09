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
const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY ? process.env.VITE_GROQ_API_KEY.trim() : "";

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
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
    });

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
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
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: error.message });
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

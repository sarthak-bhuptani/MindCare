
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const URI = process.env.MONGODB_URI;
console.log("Connecting to:", URI.split('@')[1]); // Log only the host part for safety

mongoose.connect(URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log("SUCCESS");
        process.exit(0);
    })
    .catch(err => {
        console.error("FAILURE:", err.message);
        process.exit(1);
    });

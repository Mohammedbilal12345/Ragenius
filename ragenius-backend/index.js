require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const OpenAI = require('openai');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

const upload = multer({ dest: 'uploads/' });

// ✅ Use OpenAI v4+ style
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Sample OpenAI call (for testing)
app.get('/test-openai', async (req, res) => {
  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "Hello RAGenius!" }],
    });
    res.json(chat.choices[0].message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// Health check
app.get('/', (req, res) => {
  res.send('RAGenius backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

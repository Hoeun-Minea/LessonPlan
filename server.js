// server.js - សម្រាប់ដំណើរការសាកល្បងលើ Localhost (Local Development)
require('dotenv').config();
const express = require('express');
const path = require('path');

const generateHandler = require('./api/generate');
const exportDocxHandler = require('./api/export-docx');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes (ដូចគ្នានឹង Vercel Serverless Function)
app.post('/api/generate', (req, res) => generateHandler(req, res));
app.post('/api/export-docx', (req, res) => exportDocxHandler(req, res));

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 ប្រព័ន្ធរៀបចំកិច្ចតែងការបង្រៀន AI កំពុងដំណើរការ...`);
  console.log(`🌐 បើកលើ Browser: http://localhost:${PORT}`);
  console.log(`====================================================`);
});

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

// Parse large JSON bodies (audio base64 can be big)
app.use(express.json({ limit: '50mb' }));

// Serve static PWA files
app.use(express.static(path.join(__dirname, 'public')));

// CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Proxy endpoint → Anthropic
app.post('/api/transcribe', async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY. Check Render environment variables.' });
  }

  const { audioB64, mimeType } = req.body;
  if (!audioB64 || !mimeType) {
    return res.status(400).json({ error: 'Missing audioB64 or mimeType in request body.' });
  }

  const prompt = `You are transcribing a university lecture audio. The lecture is about oscillator theory, taught in a mix of Bangla and English (Banglish — common in Bangladeshi/Bengali-medium engineering universities).

Transcribe the COMPLETE audio accurately, word by word.

Rules:
- Write Bangla/Bengali speech in Bengali Unicode script (বাংলা হরফ)
- Write English words and technical terms in English exactly as spoken
- Keep these terms in English: oscillator, frequency, capacitor, inductor, resonance, LC circuit, RC circuit, feedback, gain, amplitude, waveform, sinusoidal, phase, voltage, current, transistor, op-amp, Barkhausen criterion, damping, impedance, bandwidth, Q-factor, etc.
- Format output as timestamped subtitle segments: [MM:SS - MM:SS] text
- Keep segments 5–15 seconds each, break at natural speech pauses
- After ALL segments, write exactly "=== FULL TRANSCRIPT ===" on its own line, then the full clean text without timestamps

Transcribe every word spoken including examples, questions, and answers.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'document',
              source: { type: 'base64', media_type: mimeType, data: audioB64 }
            },
            { type: 'text', text: prompt }
          ]
        }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

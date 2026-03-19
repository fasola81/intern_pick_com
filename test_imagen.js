const fs = require('fs');
const path = require('path');
const envFile = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envFile.match(/^GEMINI_API_KEY=(.*)$/m);
process.env.GEMINI_API_KEY = apiKeyMatch ? apiKeyMatch[1].trim() : '';

async function generateTest() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No GEMINI_API_KEY found in .env.local');
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;
  const prompt = "A clean, modern flat illustration representing a marketing internship. Features a megaphone and some social media icons on a simple geometric background. Vibrant colors.";

  try {
    console.log('Fetching...');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1",
          outputOptions: { mimeType: "image/jpeg" }
        }
      })
    });

    if (!res.ok) {
        console.error('Error:', res.status, await res.text());
        return;
    }

    const data = await res.json();
    const base64 = data.predictions?.[0]?.bytesBase64Encoded;
    if (base64) {
      fs.writeFileSync('intern_marketing.jpg', Buffer.from(base64, 'base64'));
      console.log('Saved intern_marketing.jpg!');
    } else {
      console.error('No image data in response:', data);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

generateTest();

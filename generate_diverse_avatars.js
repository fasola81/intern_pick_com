const fs = require('fs');
const path = require('path');
const https = require('https');

let apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  try {
    const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
    const match = envFile.match(/GEMINI_API_KEY=(.*)/);
    if (match) apiKey = match[1].trim();
  } catch (e) {}
}

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in .env.local');
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;

const prompts = [
  "A highly realistic, professional photograph of a young Hispanic male intern working in a tech startup office. No text, no words, no icons, no symbols. Natural lighting, modern workspace environment.",
  "A highly realistic, professional photograph of a young Black female intern working in a marketing agency. No text, no words, no icons, no symbols. Natural lighting, modern workspace environment.",
  "A highly realistic, professional photograph of a young Asian male intern working in a finance firm. No text, no words, no icons, no symbols. Natural lighting, modern workspace environment.",
  "A highly realistic, professional photograph of a young Middle Eastern female intern working in a healthcare administrative role. No text, no words, no icons, no symbols. Natural lighting, modern workspace environment.",
  "A highly realistic, professional photograph of a young Indigenous male intern working in an environmental science lab. No text, no words, no icons, no symbols. Natural lighting, modern workspace environment.",
  "A highly realistic, professional photograph of a young South Asian female intern working in a software engineering role. No text, no words, no icons, no symbols. Natural lighting, modern workspace environment.",
  "A highly realistic, professional photograph of a young Caucasian male intern with glasses working in an education administration office. No text, no words, no icons, no symbols. Natural lighting, modern workspace environment.",
  "A highly realistic, professional photograph of a young mixed-race female intern working in an art and design studio. No text, no words, no icons, no symbols. Natural lighting, modern workspace environment.",
  "A highly realistic, professional photograph of a young Hispanic female intern working in a culinary or hospitality setting. No text, no words, no icons, no symbols. Natural lighting, modern workspace environment.",
  "A highly realistic, professional photograph of a young Black male intern working in an architecture or drafting firm. No text, no words, no icons, no symbols. Natural lighting, modern workspace environment.",
  "A highly realistic, professional photograph of a young Southeast Asian male intern working in retail management. No text, no words, no icons, no symbols. Natural lighting, modern workspace environment.",
  "A highly realistic, professional photograph of a young Polynesian female intern working in an event planning role. No text, no words, no icons, no symbols. Natural lighting, modern workspace environment.",
  "A highly realistic, professional photograph of a young East Asian female intern working in a legal office. No text, no words, no icons, no symbols. Natural lighting, modern workspace environment.",
  "A highly realistic, professional photograph of a young Caucasian female intern working in human resources. No text, no words, no icons, no symbols. Natural lighting, modern workspace environment.",
  "A highly realistic, professional photograph of a young Middle Eastern male intern working in a logistics and supply chain office. No text, no words, no icons, no symbols. Natural lighting, modern workspace environment."
];

async function generateImage(prompt, index) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1",
        outputOptions: { mimeType: "image/jpeg" }
      }
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.error(`Error for prompt ${index}: ${res.statusCode} ${body}`);
          resolve(false);
          return;
        }
        try {
          const json = JSON.parse(body);
          const base64 = json.predictions?.[0]?.bytesBase64Encoded;
          if (base64) {
            const buffer = Buffer.from(base64, 'base64');
            const filepath = path.join(__dirname, 'public', 'avatars', `avatar_diverse_${index}_${Date.now()}.png`);
            fs.writeFileSync(filepath, buffer);
            console.log(`Saved: ${filepath}`);
            resolve(true);
          } else {
            console.error(`No image data for prompt ${index}`);
            resolve(false);
          }
        } catch (e) {
          console.error(`Parse error for prompt ${index}:`, e);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`Request error for prompt ${index}:`, e);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Starting avatar generation...');
  for (let i = 0; i < prompts.length; i++) {
    console.log(`Generating image ${i + 1}/${prompts.length}...`);
    await generateImage(prompts[i], i + 1);
    // Sleep a bit to avoid rate limits
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log('Done.');
}

main();

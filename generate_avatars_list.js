const fs = require('fs');
const path = require('path');

const avatarsDir = path.join(__dirname, 'public/avatars');
const files = fs.readdirSync(avatarsDir).filter(f => f.endsWith('.png'));

// We want the photorealistic ones (timestamps >= 1773830100000)
const validFiles = files.filter(f => {
  const match = f.match(/_(\d+)\.png$/);
  if (!match) return false;
  const ts = parseInt(match[1], 10);
  return ts >= 1773830100000;
});

const content = `// Auto-generated list of prebuilt photorealistic avatars
export const PREBUILT_AVATARS = [
${validFiles.map(f => `  '/avatars/${f}',`).join('\n')}
];
`;

fs.writeFileSync(path.join(__dirname, 'lib/prebuilt-avatars.ts'), content);
console.log('Generated lib/prebuilt-avatars.ts with', validFiles.length, 'files.');

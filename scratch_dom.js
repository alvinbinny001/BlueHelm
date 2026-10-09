const fs = require('fs');
const code = fs.readFileSync('frontend/assets/index-CyzSREEe.js', 'utf8');

// Find what wraps main#top in Home.tsx
const idx = code.indexOf('id:"top"');
console.log("Before main#top:", code.slice(idx - 250, idx));
console.log("After main#top:", code.slice(idx, idx + 250));

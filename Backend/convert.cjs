const fs = require('fs');
const path = require('path');

const files = [
    'server.js',
    'src/services/youtubeService.js',
    'src/services/reelService.js',
    'src/services/puppeteerService.js',
    'src/services/instagramService.js',
    'src/routes/youtubeRoutes.js',
    'src/routes/reelRoutes.js',
    'src/routes/instagramRoutes.js',
    'src/models/SearchHistory.js',
    'src/middleware/rateLimiter.js',
    'src/controllers/youtubeController.js',
    'src/controllers/reelController.js',
    'src/controllers/instagramController.js'
];

files.forEach(f => {
    let content = fs.readFileSync(path.join(__dirname, f), 'utf-8');
    
    // Replace const x = require('y') with import x from 'y'
    content = content.replace(/const\s+([a-zA-Z0-9_]+)\s*=\s*require\(['"]([^'"]+)['"]\);/g, 'import $1 from \'$2\';');
    // Replace const { x, y } = require('z') with import { x, y } from 'z'
    content = content.replace(/const\s+\{([^}]+)\}\s*=\s*require\(['"]([^'"]+)['"]\);/g, 'import { $1 } from \'$2\';');
    // For 'dotenv' specifically: require('dotenv').config() -> import dotenv from 'dotenv'; dotenv.config();
    content = content.replace(/require\(['"]dotenv['"]\)\.config\(\);/g, 'import dotenv from \'dotenv\';\ndotenv.config();');
    
    // Replace exports.xxx = with export const xxx =
    content = content.replace(/exports\.([a-zA-Z0-9_]+)\s*=/g, 'export const $1 =');
    
    // Replace module.exports = with export default
    content = content.replace(/module\.exports\s*=/g, 'export default');
    
    // Fix local imports missing .js
    // Local imports start with '.' or '..'
    content = content.replace(/import\s+(.*)\s+from\s+['"](\.[^'"]+)['"]/g, (match, p1, p2) => {
        if (!p2.endsWith('.js')) {
            return `import ${p1} from '${p2}.js'`;
        }
        return match;
    });

    // Handle __dirname
    if (content.includes('__dirname') && !content.includes('fileURLToPath')) {
        const dirnameInject = `import { fileURLToPath } from 'url';\nimport { dirname } from 'path';\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = dirname(__filename);\n`;
        // Inject after last import
        const importMatches = [...content.matchAll(/^import.*$/gm)];
        if (importMatches.length > 0) {
            const lastImportIndex = importMatches[importMatches.length - 1].index + importMatches[importMatches.length - 1][0].length;
            content = content.slice(0, lastImportIndex) + '\n' + dirnameInject + content.slice(lastImportIndex);
        } else {
            content = dirnameInject + content;
        }
    }

    fs.writeFileSync(path.join(__dirname, f), content, 'utf-8');
});

console.log('Conversion done.');

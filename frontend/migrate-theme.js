import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

walkDir(srcDir, (filePath) => {
    if (filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // Branding
        content = content.replace(/Gourmet Haven/g, 'Dinex');
        content = content.replace(/frontend/g, 'Dinex');

        // Dark Theme Color Replacements
        // Backgrounds
        content = content.replace(/bg-slate-50/g, 'bg-brand-bg');
        content = content.replace(/bg-gray-50/g, 'bg-brand-bg');
        content = content.replace(/bg-white/g, 'bg-brand-card');
        content = content.replace(/bg-slate-900/g, 'bg-brand-sidebar');

        // Generic slate backgrounds
        content = content.replace(/bg-slate-\d00/g, 'bg-brand-card');

        // Text Colors
        content = content.replace(/text-slate-800/g, 'text-brand-text');
        content = content.replace(/text-gray-900/g, 'text-brand-text');
        content = content.replace(/text-slate-900/g, 'text-brand-text');
        content = content.replace(/text-slate-700/g, 'text-brand-text');
        content = content.replace(/text-gray-700/g, 'text-brand-text');
        content = content.replace(/text-white/g, 'text-brand-text'); // Be careful, but many were used on colored bgs

        content = content.replace(/text-slate-500/g, 'text-brand-muted');
        content = content.replace(/text-slate-600/g, 'text-brand-muted');
        content = content.replace(/text-gray-600/g, 'text-brand-muted');
        content = content.replace(/text-gray-400/g, 'text-brand-muted');
        content = content.replace(/text-slate-400/g, 'text-brand-muted');

        // Borders
        content = content.replace(/border-slate-100/g, 'border-brand-border');
        content = content.replace(/border-slate-200/g, 'border-brand-border');
        content = content.replace(/border-gray-200/g, 'border-brand-border');
        content = content.replace(/border-gray-300/g, 'border-brand-border');
        content = content.replace(/border-slate-800/g, 'border-brand-border');

        // Primary Buttons/Highlights (Indigo/Emerald -> Brand Primary/Button)
        content = content.replace(/text-indigo-600/g, 'text-brand-primary');
        content = content.replace(/text-emerald-600/g, 'text-brand-primary');
        content = content.replace(/text-indigo-500/g, 'text-brand-primary');
        content = content.replace(/text-emerald-500/g, 'text-brand-primary');

        content = content.replace(/bg-indigo-600/g, 'bg-brand-button');
        content = content.replace(/bg-emerald-600/g, 'bg-brand-button');
        content = content.replace(/hover:bg-indigo-700/g, 'hover:bg-brand-primary');
        content = content.replace(/hover:bg-emerald-700/g, 'hover:bg-brand-primary');

        // Remove explicit dark: classes as we are globally dark now
        content = content.replace(/dark:[^\s"']+/g, '');

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    }
});
console.log('Migration complete.');

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Plugin personalizzato: copia il .htaccess nella dist ad ogni build
const htaccessPlugin = () => ({
  name: 'copy-htaccess',
  closeBundle() {
    const content = `# Libera dalle Diete — SPA Routing\nOptions -MultiViews\nRewriteEngine On\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^ index.html [QSA,L]\n`;
    writeFileSync(resolve(__dirname, 'dist/.htaccess'), content);
    console.log('✅ .htaccess copiato in dist/');
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), htaccessPlugin()],
})

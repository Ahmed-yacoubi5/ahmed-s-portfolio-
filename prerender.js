import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function prerender() {
  const distDir = path.resolve(__dirname, 'dist');
  const templatePath = path.resolve(distDir, 'index.html');
  const ssrEntryPath = path.resolve(distDir, 'ssr', 'entry-server.js');

  if (!fs.existsSync(templatePath)) {
    console.error('Error: dist/index.html not found');
    process.exit(1);
  }

  if (!fs.existsSync(ssrEntryPath)) {
    console.error('Error: dist/ssr/entry-server.js not found');
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');
  const { render } = await import(pathToFileURL(ssrEntryPath).href);

  const { html: appHtml } = render();

  const renderedHtml = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );

  fs.writeFileSync(templatePath, renderedHtml, 'utf-8');
  console.log('✓ Successfully pre-rendered static HTML into dist/index.html for instant static CDN delivery.');

  // Clean up the temporary ssr directory
  fs.rmSync(path.resolve(distDir, 'ssr'), { recursive: true, force: true });
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});

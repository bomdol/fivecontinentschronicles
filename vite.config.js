import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// 개발: images/ 디렉터리를 /images/ 경로로 서빙
// 빌드: images/ 를 dist/images/ 로 복사
function imagePlugin() {
  return {
    name: 'serve-images',
    configureServer(server) {
      server.middlewares.use('/images/', (req, res, next) => {
        const file = path.resolve(__dirname, 'images', req.url.replace(/^\//, ''));
        if (fs.existsSync(file)) {
          res.setHeader('Content-Type', 'image/png');
          fs.createReadStream(file).pipe(res);
        } else {
          next();
        }
      });
    },
    closeBundle() {
      const src = path.resolve(__dirname, 'images');
      const dst = path.resolve(__dirname, 'dist', 'images');
      if (!fs.existsSync(src)) return;
      fs.mkdirSync(dst, { recursive: true });
      for (const f of fs.readdirSync(src)) {
        fs.copyFileSync(path.join(src, f), path.join(dst, f));
      }
      console.log('[imagePlugin] images/ → dist/images/ 복사 완료');
    },
  };
}

export default defineConfig({
  plugins: [react(), imagePlugin()],
  root: '.',
  build: { outDir: 'dist' },
});

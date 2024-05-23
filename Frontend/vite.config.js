// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import path from 'path';
// import commonjs from 'vite-plugin-commonjs';

// const pathBrowserifyAbsolutePath = path.resolve(__dirname, 'node_modules/path-browserify');

export default defineConfig({
  plugins: [react(),
    // commonjs(),
  ],
  // resolve: {
  //   alias: {
  //     process: 'process/browser',
  //     path: pathBrowserifyAbsolutePath,
  //   },
  // },
  // optimizeDeps: {
  //   exclude: ['axios', 'events', 'url', 'http', 'buffer'],
  // },
});

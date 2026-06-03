// Polyfill per Safari/WebKit — ReadableStream[Symbol.asyncIterator]
// Questo file viene importato come worker tramite Vite ?worker
// e importa il modulo worker di PDF.js

import 'pdfjs-dist/build/pdf.worker.min.mjs';
